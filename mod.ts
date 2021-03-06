const decoder = new TextDecoder();
export const decode = (x: Uint8Array) => decoder.decode(x);

export const getNetworkAddr = async () => {
  const isWin = Deno.build.os === 'windows';
  const command = isWin ? 'ipconfig' : 'ifconfig';
  try {
    let ifconfig = await Deno.run({
      cmd: [command],
      stdout: 'piped',
    });

    const { success } = await ifconfig.status();
    if (!success) {
      throw new Error(`Subprocess ${command} failed to run`);
    }

    const raw = await ifconfig.output();
    const text = decode(raw);

    if (isWin) {
      const addrs = text.match(new RegExp('ipv4.+([0-9]+.){3}[0-9]+', 'gi'));
      let temp = addrs
        ? addrs[0].match(new RegExp('([0-9]+.){3}[0-9]+', 'g'))
        : undefined;
      const addr = temp ? temp[0] : undefined;
      await Deno.close(ifconfig.rid);
      if (!addr) {
        throw new Error('Could not resolve your local adress.');
      }
      return addr;
    } else {
      const addrs = text.match(
        new RegExp('inet (addr:)?([0-9]*.){3}[0-9]*', 'g')
      );
      await Deno.close(ifconfig.rid);
      if (!addrs || !addrs.some((x) => !x.startsWith('inet 127'))) {
        throw new Error('Could not resolve your local adress.');
      }
      return (
        addrs &&
        addrs
          .find((addr: string) => !addr.startsWith('inet 127'))
          ?.split('inet ')[1]
      );
    }
  } catch (err) {
    console.log(err.message);
  }
};
