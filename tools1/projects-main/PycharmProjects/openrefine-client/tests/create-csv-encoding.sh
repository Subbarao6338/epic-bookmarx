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

cat << "DATA" > "tmp/${t}/${t}-utf8.csv"
a,b,c
1,2,3
ä,é,ß
$,\,'
DATA
iconv -f UTF-8 -t ISO-8859-1 "tmp/${t}/${t}-utf8.csv" > "tmp/${t}/${t}.csv"

# ================================= ASSERTION ================================ #

cat << "DATA" > "tmp/${t}/${t}.assert"
a	b	c
1	2	3
ä	é	ß
$	\	'
DATA

# ================================== ACTION ================================== #

${cmd} --create "tmp/${t}/${t}.csv" --encoding "ISO-8859-1"
${cmd} --export "${t}" --output "tmp/${t}/${t}.output"

# =================================== TEST =================================== #

diff -u "tmp/${t}/${t}.assert" "tmp/${t}/${t}.output"
