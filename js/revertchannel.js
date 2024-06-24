(async () => {
  'use strict';

  while (typeof Roblox == "undefined" || typeof Roblox.ProtocolHandlerClientInterface == "undefined") await new Promise(resolve => setTimeout(resolve))

  try {
    let ProtocolHandlerClientInterface = Roblox.ProtocolHandlerClientInterface
    Object.defineProperty(ProtocolHandlerClientInterface, "playerChannel", {
        value: "",
        writable: false
    });
    Object.defineProperty(ProtocolHandlerClientInterface, "channel", {
        value: "",
        writable: false
    });
    Object.defineProperty(ProtocolHandlerClientInterface, "studioChannel", {
        value: "",
        writable: false
    });

    console.warn("Roblox channel reverted successfully!")
  } catch (exception) {
      console.warn("There was an error trying to set the channel:");
      console.error(exception);
  }
})()