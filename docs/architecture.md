Architecture of the Rosie System

![Rosie Architecture](RosieHome.png "Rosie Architecture")

Everything in the Rosie system revolves around a central gateway or hub that handles device communication. As MUCH AS POSSIBLE, smart devices in a home talk to the hub and NOT to the cloud. Those that talk to the cloud because of vendor limitations are walled off, and the hub communicates with those vendor cloud services to pull data and take action.

The hub does not push data to the cloud for non-vendor scenarios. It does not have a public IP address. Right now, this does mean that one cannot control the hub when not on the home network. This is something we hope to resolve in the short term.

The system also includes a repository that is separate from the hub that handles storage of home data, alerts and the like. It also hosts dashboards and data visualizations for a home. The dashboard software and the hub are the only systems that have access to the repository. No other devices have direct access.

All clients, like web, mobile or view apps speak exclusively through the hub. They do not speak directly to the repository, nor to any 3rd party cloud services.