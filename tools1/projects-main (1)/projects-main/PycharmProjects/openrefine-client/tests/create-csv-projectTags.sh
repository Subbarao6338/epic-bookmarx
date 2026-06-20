#!/bin/bash

# =============================== ENVIRONMENT ================================ #

if [[ ${1} ]]; then
  cmd="${1}"
else
  echo 1>&2 "execute tests-cli.sh to run all tests"; exit 1
fi
if [[ ${2} ]]; then
  version="${2}"
fi

t="$(basename "${BASH_SOURCE[0]}" .sh)"
cd "${BASH_SOURCE%/*}/" || exit 1
mkdir -p "tmp/${t}"

# =================================== DATA =================================== #

cat << "DATA" > "tmp/${t}/${t}.csv"
a,b,c
1,2,3
0,0,0
$,\,'
DATA

# ================================= ASSERTION ================================ #

if [[ "${version:0:1}" = "2" ]]; then
  echo "projectTags were introduced in OpenRefine 3.0"
  exit 200
else
  cat << "DATA" > "tmp/${t}/${t}.assert"
                tags: [u'beta', u'client1']
DATA
fi

# ================================== ACTION ================================== #

${cmd} --create "tmp/${t}/${t}.csv" --projectTags "beta" --projectTags "client1"
${cmd} --info "${t}" | grep ' tags: ' > "tmp/${t}/${t}.output"

# =================================== TEST =================================== #

diff -u "tmp/${t}/${t}.assert" "tmp/${t}/${t}.output"
