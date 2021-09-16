#!/bin/bash
set -e
service mysql start
mysql < /home/storage/migration-1631712940.sql
service mysql stop
