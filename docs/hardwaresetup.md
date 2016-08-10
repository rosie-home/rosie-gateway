# Recommended Hardware Setup for the Rosie Gateway

The purpose of the Rosie gateway is to serve as the central "brain" of your smart home, facilitating communication between devices and orchestrating cross-device workflows.

A key aspect of the gateway is support for the communication protocols you need in your home. For starters, you should at least be able to support:

- HTTP (via Wifi or Ethernet)
- MQTT (via Wifi or Ethernet)

These two protocols should enable you to support a large number of connect home devices, especially newer third-party commercial products. For broader home sensor support, you may also need to support messaging via:

- BLE
- ZigBee (or Thread)
- ZWave

For simple connectivity scenarios, your Gateway can run on the following hardware setup:

- Raspberry Pi 3 (or Raspberry Pi 2 with a Wifi dongle)
- 16+ GB SD Card (Type 10) - Get a larger card (64+ GB if running the Gateway and Repository on the same system)

If you need to support more complex connectivity, you can still opt for the Raspberry Pi as your base, but you'll need to add support for other communication protocols via Pi Hats or through your own addon boards.

Another alternative is to grab a board that supports more complex protocols out of the box, like the [Samsung Artik 5](http://www.digikey.com/product-detail/en/samsung-semiconductor-inc/SIP-KITNXB001/1510-1316-ND/5825102).