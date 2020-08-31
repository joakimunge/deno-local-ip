const decoder = new TextDecoder();
export const decode = (x: Uint8Array) => decoder.decode(x);

export const getNetworkAddr = async () => {
  let ifconfig: Deno.Process | undefined;
  try {
    ifconfig = await Deno.run({
      cmd: ['ifconfig'],
      stdout: 'piped',
    });
    const { success } = await ifconfig.status();
    if (!success) {
      throw new Error('Subprocess ifconfig failed to run');
    }
    const raw = await ifconfig.output();
    const text = decode(raw);
    const addrs = text.match(
      new RegExp('inet (addr:)?([0-9]*.){3}[0-9]*', 'g')
    );
    if (!addrs || !addrs.some((x) => !x.startsWith('inet 127'))) {
      throw new Error('Could not resolve your local adress.');
    }

    await Deno.close(ifconfig.rid);

    return (
      addrs &&
      addrs
        .find((addr: string) => !addr.startsWith('inet 127'))
        ?.split('inet ')[1]
    );
  } catch (err) {
    ifconfig && (await Deno.close(ifconfig.rid));
    console.log(err.message);
  }
};
