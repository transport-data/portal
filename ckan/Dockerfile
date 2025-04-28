FROM ckan/ckan-base:2.11.2

ENV CKAN_INI /srv/app/ckan.ini

ENV CKANEXT_TDC_HASH 6b4be38a626bf1a42d4dc771d5c0c2daaa933a46

USER root

# Install any extensions needed by your CKAN instance
RUN pip3 install -e 'git+https://github.com/datopian/ckanext-scheming.git@27035f4d5b3722c2bc64d39b6c2b1d76c9883636#egg=ckanext-scheming' && \
    pip3 install -r 'https://raw.githubusercontent.com/datopian/ckanext-scheming/27035f4d5b3722c2bc64d39b6c2b1d76c9883636/test-requirements.txt' && \
    pip3 install -r 'https://raw.githubusercontent.com/shubham-mahajan/ckanext-s3filestore/feature/r2support-ckan-2.11/requirements.txt' && \
    pip3 install -e 'git+https://github.com/shubham-mahajan/ckanext-s3filestore.git@feature/r2support-ckan-2.11#egg=ckanext-s3filestore' && \
    pip3 install -e "git+https://github.com/transport-data/tdc-data-portal.git@${CKANEXT_TDC_HASH}#egg=ckanext-tdc&subdirectory=src/ckanext-tdc"

RUN apt update && apt install -y --no-install-recommends procps postgresql-client

## Auth
# RUN pip3 install --no-cache-dir -e git+https://github.com/datopian/ckanext-auth.git@v2.11#egg=ckanext-auth

## DCAT
RUN  pip3 install -e git+https://github.com/ckan/ckanext-dcat.git@v2.0.0#egg=ckanext-dcat && \
    pip3 install -r https://raw.githubusercontent.com/ckan/ckanext-dcat/v2.0.0/requirements.txt

## Hierarchy
RUN  pip3 install -e git+https://github.com/ckan/ckanext-hierarchy.git@abb4e2d3961a88c2622e4b4bdec1d711b677dc7c#egg=ckanext-hierarchy && \
    pip3 install -r https://raw.githubusercontent.com/ckan/ckanext-hierarchy/abb4e2d3961a88c2622e4b4bdec1d711b677dc7c/requirements.txt

# Fixes an error related to s3filestore plugin in the r2support-ckan-2.11 branch 
RUN pip install boto3==1.35.77

## Install the 'patch' command
RUN apt-get update && apt-get install -y patch && rm -rf /var/lib/apt/lists/*

COPY setup/prerun.py ${APP_DIR}/prerun.py
RUN chmod +x ${APP_DIR}/prerun.py
    
ENV CKAN__PLUGINS tdc hierarchy_display scheming_datasets scheming_groups scheming_organizations dcat datatables_view image_view text_view s3filestore datastore datapusher activity envvars

COPY patches/ckan/* ${APP_DIR}/patches/ckan/

RUN for d in $APP_DIR/patches/*; do \
        for f in `ls $d/*.patch | sort -g`; do \
			cd $SRC_DIR/`basename "$d"` && echo "$0: Applying patch $f to $SRC_DIR/`basename $d`"; cd ${APP_DIR}/src && git apply --ignore-space-change --ignore-whitespace "$f" ; \
        done ; \
    done


USER ckan

COPY licenses.json /ext/licenses.json

RUN ckan config-tool ${CKAN_INI} "ckan.plugins = ${CKAN__PLUGINS}"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.anon_create_dataset = false"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.create_unowned_dataset = false"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.allow_dataset_collaborators = true"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.allow_admin_collaborators = true"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.create_dataset_if_not_in_organization = false"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.public_user_details = true"
RUN ckan config-tool ${CKAN_INI} "ckan.group_and_organization_list_all_fields_max = 350"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.create_user_via_web = false"

RUN ckan config-tool ${CKAN_INI} "ckan.auth.user_create_groups = false"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.user_create_organizations = false"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.user_delete_groups = false"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.user_delete_organizations = false"

RUN ckan config-tool ${CKAN_INI} "ckan.plugins = ${CKAN__PLUGINS}"
