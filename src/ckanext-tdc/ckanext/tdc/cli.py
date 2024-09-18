import ckanext.tdc.geographies as geographies

import click


@click.command()
def create_default_geographies():
    geographies.create_default_tdc_geographies()


@click.command()
def delete_default_geographies():
    geographies.delete_default_tdc_geographies()


@click.command()
def list_default_geographies():
    geographies.list_default_tdc_geographies()


def get_commands():
    return [create_default_geographies,
            delete_default_geographies,
            list_default_geographies]
