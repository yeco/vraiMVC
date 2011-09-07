SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js

BASE_FILES = ${SRC_DIR}/model.js\
	${SRC_DIR}/view.js

MODULES = ${SRC_DIR}/intro.js\
	${BASE_FILES}\
	${SRC_DIR}/outro.js

vMVC = ${DIST_DIR}/vraiMVC.js
vMVC_MIN = ${DIST_DIR}/vraiMVC.min.js


vMVC_VER = $(shell cat version.txt)
VER = sed "s/@VERSION/${vMVC_VER}/"

DATE=$(shell git log -1 --pretty=format:%ad)

all: update_submodules core

core: vraiMVC min lint
	@@echo "vraiMVC build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

vraiMVC: ${vMVC}

${vMVC}: ${MODULES} | ${DIST_DIR}
	@@echo "Building" ${vMVC}

	@@cat ${MODULES} | \
		sed 's/.function..vraiMVC...{//' | \
		sed 's/}...vraiMVC..;//' | \
		sed 's/@DATE/'"${DATE}"'/' | \
		${VER} > ${vMVC};


lint: vraiMVC
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking vraiMVC against JSLint..."; \
		${JS_ENGINE} build/jslint-check.js; \
	else \
		echo "You must have NodeJS installed in order to test vraiMVC against JSLint."; \
	fi

min: vraiMVC ${vMVC_MIN}

${vMVC_MIN}: ${vMVC}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying vraiMVC" ${vMVC_MIN}; \
		${COMPILER} ${vMVC} > ${vMVC_MIN}.tmp; \
		${POST_COMPILER} ${vMVC_MIN}.tmp > ${vMVC_MIN}; \
		rm -f ${vMVC_MIN}.tmp; \
	else \
		echo "You must have NodeJS installed in order to minify vraiMVC."; \
	fi
	

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}


# change pointers for submodules and update them to what is specified in vraiMVC
# --merge  doesn't work when doing an initial clone, thus test if we have non-existing
#  submodules, then do an real update
update_submodules:
	@@if [ -d .git ]; then \
		if git submodule status | grep -q -E '^-'; then \
			git submodule update --init --recursive; \
		else \
			git submodule update --init --recursive --merge; \
		fi; \
	fi;

# update the submodules to the latest at the most logical branch
pull_submodules:
	@@git submodule foreach "git pull \$$(git config remote.origin.url)"
	@@git submodule summary

pull: pull_submodules
	@@git pull ${REMOTE} ${BRANCH}

.PHONY: all vraiMVC lint min clean distclean update_submodules pull_submodules pull core
