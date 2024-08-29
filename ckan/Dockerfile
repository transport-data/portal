FROM viderum/ckan:v2.11.0

ENV CKAN_INI /srv/app/production.ini

# Install any extensions needed by your CKAN instance
RUN pip3 install -e 'git+https://github.com/datopian/ckanext-scheming.git@ckan-2.10#egg=ckanext-scheming' && \
    pip3 install -r 'https://raw.githubusercontent.com/datopian/ckanext-scheming/ckan-2.10/test-requirements.txt' && \
    pip3 install -r 'https://raw.githubusercontent.com/shubham-mahajan/ckanext-s3filestore/feature/r2support-ckan-2.11/requirements.txt' && \
    pip3 install -e 'git+https://github.com/datopian/ckanext-auth.git@109ac1672cf458919e2736d95c516f43c6768021#egg=ckanext-auth' && \
    pip3 install -e 'git+https://github.com/shubham-mahajan/ckanext-s3filestore.git@feature/r2support-ckan-2.11#egg=ckanext-s3filestore' && \
    pip3 install -e "git+https://github.com/transport-data/tdc-data-portal.git@80598beda6e7121d247b0a0893ff48d7e6af3632#egg=ckanext-tdc&subdirectory=src/ckanext-tdc" && \
    pip3 install -e 'git+https://github.com/ckan/ckanext-pages.git@ca68f37faf2c43eff251bd16fb5af8f5b4cd8b1b#egg=ckanext-pages'
    
## Install the 'patch' command
USER root

RUN apk --no-cache add patch
COPY setup/prerun.py ${APP_DIR}/prerun.py
RUN chmod +x ${APP_DIR}/prerun.py
    
ENV CKAN__PLUGINS envvars datatables_view image_view text_view  s3filestore datastore datapusher
USER ckan

COPY licenses.json /ext/licenses.json

RUN ckan config-tool ${CKAN_INI} "ckan.plugins = ${CKAN__PLUGINS}"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.anon_create_dataset = false"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.create_unowned_dataset = false"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.allow_dataset_collaborators = true"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.allow_admin_collaborators = true"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.create_dataset_if_not_in_organization = false"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.public_user_details = false"
RUN ckan config-tool ${CKAN_INI} "ckan.auth.create_user_via_web = false"

RUN ckan config-tool ${CKAN_INI} "ckan.plugins = ${CKAN__PLUGINS}"
