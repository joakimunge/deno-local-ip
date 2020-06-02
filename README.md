# Deno Local Ip

Tiny module for Deno to get local network interface address.

_Does not currently work on windows_

## Usage

> NOTE: Requires the all mighty `--allow-run` option as it spawns the subprocess `ifconfig` under the hood, to fetch the network interfaces.

```typescript
import { getNetworkAddr } from 'https://deno.land/x/local_ip/mod.ts';

const netAddr = await getNetworkAddr(); // 192.168.0.17
```

## Reasoning

Currently Deno does not provide a way to access local network interfaces. Sometimes this is useful when you need to know your local network address.

When this implementation gets finished, this module will probably be deprecated: https://github.com/denoland/deno/issues/3802
