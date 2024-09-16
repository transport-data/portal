import ckanext.tdc.geographies as geographies

import click


@click.command()
def create_default_geographies():
    geographies.create_default_tdc_geographies()


def get_commands():
    return [create_default_geographies]
