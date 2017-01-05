discourse-api
=============
[![Known Vulnerabilities](https://snyk.io/test/github/dhyasama/discourse-api/0b0f8cc9a7fd9d19a580166469e003542f87c1de/badge.svg)](https://snyk.io/test/github/dhyasama/discourse-api/0b0f8cc9a7fd9d19a580166469e003542f87c1de)

A simple Node wrapper for the Discourse API

This is just a quick stab at using the Discourse api within a Node project I'm working on. It's rough and has limited
coverage at the moment but will get better with time. Contributions are welcome.

I added Vagrant to make testing easier. A local box is fastest. I've also set it up to use the Digital Ocean provider.
Both using Sam Saffron's Discourse Docker project. After getting Discourse running with Docker, create a package or a
snapshot and then use vagrant to fire it up for testing.

https://github.com/SamSaffron/discourse_docker

https://github.com/smdahlen/vagrant-digitalocean
