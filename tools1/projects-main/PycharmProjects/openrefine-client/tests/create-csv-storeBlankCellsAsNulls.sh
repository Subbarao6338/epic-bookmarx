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

cat << "DATA" > "tmp/${t}/${t}.csv"
a,b,c
1,2,3
0,,0
$,\,'
DATA

cat << "DATA" > "tmp/${t}/${t}.transform"
[
  {
    "op": "core/text-transform",
    "engineConfig": {
      "facets": [],
      "mode": "row-based"
    },
    "columnName": "b",
    "expression": "grel:isNull(value)",
    "onError": "keep-original",
    "repeat": false,
    "repeatCount": 10
  }
]
DATA

# ================================= ASSERTION ================================ #

cat << "DATA" > "tmp/${t}/${t}.assert"
a	b	c
1	false	3
0	false	0
$	false	'
DATA

# ================================== ACTION ================================== #

${cmd} --create "tmp/${t}/${t}.csv" --storeBlankCellsAsNulls "false"
${cmd} --apply "tmp/${t}/${t}.transform" "${t}"
${cmd} --export "${t}" --output "tmp/${t}/${t}.output"

# =================================== TEST =================================== #

diff -u "tmp/${t}/${t}.assert" "tmp/${t}/${t}.output"
