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

## Installing Telegraf

1. To collect server stats from the gateway, you'll need to install telegraf.

  ```
  cd ~
  wget https://dl.influxdata.com/telegraf/releases/telegraf-0.13.1-1_linux_armhf.tar.gz
  tar xvfz telegraf-0.13.1-1_linux_armhf.tar.gz
  cd telegraf-0.13.1-1
  ```

  Once you've installed Telegraf, you'll need to modify the `telegraf.conf` file to log to the remote InfluxDB instance on your Repository. 
  Note: If you've not yet completed the [Repository setup steps](https://github.com/rosie-home/rosie-repository/blob/master/docs/softwaresetup.md) do that first and then return to complete configuring Telegraf on your gateway.

2. Open the `telegraf.conf` file for editing

  ```
  vi etc/telegraf/telegraf.conf
  ```

3. On line 60 (`:60`), set the `hostname` to your gateway named

  ```bash
  hostname = "Rosie-Gateway"
  ````

4. On line 74 (`:74`), set the `urls` value to the IP address of your repository server

  ```bash
  urls = ["http://10.171.5.129:8086"]
  ```

5. On line 76 (`:76`), set the database value to the same database you're using for repository statistics (default is `telegraf`)

  ```bash
  database = "telegraf"
  ```

6. On line 82 (`:82`), set the `retention_policy` value. Every InfluxDB database has one or more rentention policies that dictate
how long data is stored before deletion. On my repository, I have a few policies, one that keeps data for two days and one for two weeks. 
Since I only want server data for heartbeat purposes, and it logs frequently, I'll use a shorter policy.

For more information on creating retention policies in InfluxDB [see this article](https://docs.influxdata.com/influxdb/v0.13/query_language/database_management/#retention-policy-management).

  ```bash
  ## Retention policy to write to.
  retention_policy = "two_days_only"
  ```

7. On lines 89 and 90, set the user name, set the username and password for your InfluxDB instance

  ```
  username = "admin"
  password = "admin"
  ```

8. Hit the `ESC` key and type `wq!` to save your changes.

9. TO ensure that everything is working, run telegraf with the recently edited config file:

```
~/telegraf-0.13.1-1/usr/bin/telegraf -config ~/telegraf-0.13.1-1/etc/telegraf/telegraf.conf
```

## Auto-starting services

### Auto-starting node-red

Once you've installed node-red and mosquitto on your Gateway, you'll want to configure them to auto-run when you hub starts up.

1. Create a new file named `nodered` at /etc/init.d/ and change permissions on the file to enable execution

```
$ mkdir /etc/init.d/nodered
$ chmod 755 /etc/init.d/nodered
```

2. Download [this init.d script](https://gist.github.com/bigmonkeyboy/9962293) for node-red and copy it into the file you created in the last step. Alternatively, you can copy the code below. If you download the file linked, be sure to 
change the first uncommented line from `USER=pi` to `USER=root`.

```bash
#! /bin/sh
# Starts and stops Node-RED
# /etc/init.d/nodered
### BEGIN INIT INFO
# Provides:     node-red
# Required-Start:       $syslog
# Required-Stop:        $syslog
# Default-Start:        2 3 4 5
# Default-Stop:         0 1 6
# Short-Description:    Node-RED initialisation
### END INIT INFO
# Can be downloaded and installed in one go by using this command
# sudo wget -O /tmp/download https://gist.github.com/bigmonkeyboy/9962293/download && sudo tar -zxf /tmp/download --strip-components 1 -C /etc/init.d && sudo chmod 755 /etc/init.d/nodered && sudo update-rc.d nodered defaults

# This runs as the user called pi - please change as you require
USER=root

# The log is written to here - please make sure your user has write permissions.
LOG=/var/log/node-red.log

#Load up node red when called
case "$1" in

start)
    if pgrep ^node-red$ > /dev/null
    then
        echo "Node-RED already running."
    else
        echo "Starting Node-Red.."
        touch $LOG
        chown $USER:$USER $LOG
        echo "" >> $LOG
        echo "Node-RED service start: "$(date) >> $LOG
#        su -l $USER -c "cd ~/.node-red && screen -dmS red node-red-pi --max-old-space-size=128"
# or
        su -l $USER -c "node-red-pi --max-old-space-size=128 -u ~/.node-red >> $LOG &"
        echo "Logging to "$LOG
    fi
;;

stop)
    echo "Stopping Node-Red.."
#        su -l $USER -c "screen -S red -X quit"
# or
    pkill -SIGINT ^node-red$
    sleep 2
    echo "" >> $LOG
    echo "Node-RED service stop: "$(date) >> $LOG
;;

restart)
        echo "Restarting Node-Red.."
        $0 stop
        sleep 2
        $0 start
        echo "Restarted."
;;
*)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
esac
```` 

3. Use `chkconfig` to modify runlevel settings on the nodered service

```
$ chkconfig --add nodered
$ chkconfig --level 2345 nodeted on
```

4. Start the service to make sure everything worked

```
/etc/rc.d/init.d/nodered start
```

### Auto-starting mosquitto

1. Create a conf file basd on the preinstalled example file

```
mv /etc/mosquitto/mosquitto.conf.example /etc/mosquitto/mosquitto.conf
```

2. Use the systemd utility to enable and start the service

```
systemctl enable mosquitto.service
systemctl start mosquitto.service
```

### Auto-starting Telegraf

1. Create a service file in the Systemd folder. 

```
touch /usr/lib/systemd/system/telegraf.service
```

If the file already exists, skip to the next step.

2. Open the file for editing and paste the following

```
[Unit]
Description=The plugin-driven server agent for reporting metrics into InfluxDB
Documentation=https://github.com/influxdata/telegraf
After=network.target

[Service]
EnvironmentFile=-/etc/default/telegraf
User=root
Environment='STDOUT=/var/log/telegraf/telegraf.log'
Environment='STDERR=/var/log/telegraf/telegraf.log'
ExecStart=/bin/sh -c "exec ~/telegraf-0.13.1-1/usr/bin/telegraf -config ~/telegraf-0.13.1-1/etc/telegraf/telegraf.conf ${TELEGRAF_OPTS} >>${STDOUT} 2>>${STDERR}"
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
KillMode=control-group

[Install]
WantedBy=multi-user.target
Alias=telegraf.service
```

3. Finally, reload the systemd daemon and start the service

```
systemctl daemon-reload
systemctl enable telegraf
systemctl start telegraf
```