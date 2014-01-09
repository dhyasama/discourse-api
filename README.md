discourse-api
=============

A simple Node wrapper for the Discourse API

This is just a quick stab at using the Discourse api within a Node project I'm working on. It's rough and has limited
coverage at the moment but will get better with time. Contributions are welcome.

I added Vagrant to make testing easier. It's currently setup to use the Digital Ocean provider and Sam Saffron's
Discourse Docker project. After getting Discourse running with Docker on Digital Ocean, create a snapshot and then
use vagrant to create a droplet for testing.

https://github.com/SamSaffron/discourse_docker

https://github.com/smdahlen/vagrant-digitalocean