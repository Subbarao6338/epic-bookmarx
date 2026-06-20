#!/usr/bin/env python
"""
Script to provide a command line interface to a Refine server.
"""

# Copyright (c) 2011 Paul Makepeace, Real Programmers. All rights reserved.

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>

import sys

from google.refine import __main__, cli, refine

# workaround for pyinstaller
if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    reload(sys)
    sys.setdefaultencoding('utf-8')
    if sys.platform == "win32":
        import codecs
        codecs.register(lambda name: codecs.lookup(
            'utf-8') if name == 'cp65001' else None)

if __name__ == '__main__':
    __main__.main()
