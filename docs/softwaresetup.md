# Software Setup for the Rosie Gateway

The Below instructions assume you're installing node-red and mosquitto on a Samsung Artik 5 or 10, which runs Fedora 22. For alternative or general installation
instructions, see the [node-red documentation](http://nodered.org/docs/getting-started/installation).

## Installing Node-Red

1. Update your package manager (dnf in the case of Fedora) to ensure you have the last package list

```
$ dnf update
```

2. Install node & npm

```
$ dnf install node
$ dnf install npm
```

3. Install node-red

```
$ npm install -g node-red
```

4. Start node-red (as a background process) and make sure everything runs fine

```
$ node-red &
```

## Instaling Mosquitto

Assuming you've already installed node-red as listed above, installing mosquitto is simple

```
$ dnf install mosquitto
```

Now, run mosquitto as a background process to make sure that things are ok.

```
$ mosquitto &
```

## Auto-starting services