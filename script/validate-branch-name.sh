#!/bin/bash
function git.branch() {
  br=`git branch | grep \\* | cut -d " " -f2`
  echo ${br/* /}
}
name=`git.branch`
re="_"
if [[ $name =~ $re ]]; then echo -e "\033[41;37m 分支名不能包含'_'下划线 \033[0m" && exit 1; else exit 0; fi
