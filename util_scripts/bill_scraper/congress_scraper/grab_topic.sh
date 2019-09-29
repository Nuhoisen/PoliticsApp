#!/bin/sh

grep -rl --include '*.xml' -i -E -f subject_lists/$1.txt ./congress/data >> path_lists/$1.txt 


grep -rl --include '*.json' -i -E -f subject_lists/$1.txt ./congress/data/100 >> path_lists/$1.txt 
grep -rl --include '*.json' -i -E -f subject_lists/$1.txt ./congress/data/100 >> path_lists/$1.txt 
grep -rl --include '*.json' -i -E -f subject_lists/$1.txt ./congress/data/108 >> path_lists/$1.txt 
