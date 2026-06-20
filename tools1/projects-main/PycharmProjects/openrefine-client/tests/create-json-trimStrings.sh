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

cat << "DATA" > "tmp/${t}/${t}.json"
[
  {
    "a": 1,
    "b": 2,
    "c": 3
  },
  {
    "a": "0",
    "b": " 0",
    "c": "0 "
  },
  {
    "a": "$",
    "b": "\\",
    "c": "\""
  }
]
DATA

# ================================= ASSERTION ================================ #

if [[ "${version:0:1}" = "2" || "${version}" = "3.0" || "${version}" = "3.1" || "${version}" = "3.2" || "${version}" = "3.3" ]]; then
  echo "trimStrings option does not work in OpenRefine <=3.3"
  echo "https://github.com/OpenRefine/OpenRefine/issues/2409"
  exit 200
else
  cat << "DATA" > "tmp/${t}/${t}.assert"
_ - a	_ - b	_ - c
1	2	3
0	0	0
$	\	""""
DATA
fi

# ================================== ACTION ================================== #

${cmd} --create "tmp/${t}/${t}.json" --trimStrings "true"
${cmd} --export "${t}" --output "tmp/${t}/${t}.output"

# =================================== TEST =================================== #

diff -u "tmp/${t}/${t}.assert" "tmp/${t}/${t}.output"
