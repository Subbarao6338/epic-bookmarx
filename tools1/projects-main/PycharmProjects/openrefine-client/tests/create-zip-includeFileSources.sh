#!/bin/bash

# =============================== ENVIRONMENT ================================ #

if [[ ${1} ]]; then
  cmd="${1}"
else
  echo 1>&2 "execute tests-cli.sh to run all tests"; exit 1
fi

t="$(basename "${BASH_SOURCE[0]}" .sh)"
cd "${BASH_SOURCE%/*}/" || exit 1
mkdir -p "tmp/${t}"

# =================================== DATA =================================== #

cat << "DATA" > "tmp/${t}/${t}-1.csv"
a,b,c
1,2,3
DATA

cat << "DATA" > "tmp/${t}/${t}-2.csv"
a,b,c
4,5,6
DATA

zip "tmp/${t}/${t}.zip" "tmp/${t}/${t}-1.csv" "tmp/${t}/${t}-2.csv"

# ================================= ASSERTION ================================ #

cat << DATA > "tmp/${t}/${t}.assert"
File	a	b	c
tmp/${t}/${t}-1.csv	1	2	3
tmp/${t}/${t}-2.csv	4	5	6
DATA

# ================================== ACTION ================================== #

${cmd} --create "tmp/${t}/${t}.zip" --includeFileSources "true"
${cmd} --export "${t}" --output "tmp/${t}/${t}.output"

# =================================== TEST =================================== #

diff -u "tmp/${t}/${t}.assert" "tmp/${t}/${t}.output"
