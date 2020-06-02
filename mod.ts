const decoder = new TextDecoder();
export const decode = (x: Uint8Array) => decoder.decode(x);

export const getNetworkAddr = async () => {
  try {
    const ifconfig = await Deno.run({
      cmd: ['ifconfig'],
      stdout: 'piped',
      stderr: 'piped',
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
      throw new Error('Could not find any local adress.');
    }

    return (
      addrs && addrs.find((x) => !x.startsWith('inet 127'))?.split('inet ')[1]
    );
  } catch (err) {
    console.log(err.message);
  }
};
