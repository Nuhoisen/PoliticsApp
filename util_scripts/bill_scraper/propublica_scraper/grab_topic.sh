#!/bin/sh

grep -rl --include '*.xml'  -i -E -f subject_lists/$1.txt ./congress/data >> path_lists/$1.txt 
