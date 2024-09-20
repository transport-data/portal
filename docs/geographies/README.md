# Geographies

Geographies are custom CKAN groups that can be either `regions` or `countries`. You can learn more about the `geography` entity at [the metadata schema docs](../metadata-schema#entities).

The default countries and regions for this instance are based on the United Nations geoscheme.

## Commands

### Seed default geographies

In order to seed an instance with the default countries and regions, run the following CLI command:

```bash
ckan -c ckan.ini create-default-geographies

```

### Delete default geographies

```bash
ckan -c ckan.ini delete-default-geographies

```

### List default geographies

```bash
ckan -c ckan.ini list-default-geographies

```

## List of default geographies

The following geographies are created by default when `create-default-geographies` is run:

| Code  | Title                                                | Type           | M49 code | Region        |
| ----- | ---------------------------------------------------- | -------------- | -------- | ------------- |
| asi   | Asia                                                 | region         | 142      |               |
| afg   | Afghanistan                                          | country        | 004      | asi           |
| are   | United Arab Emirates                                 | country        | 784      | asi           |
| arm   | Armenia                                              | country        | 051      | asi           |
| aze   | Azerbaijan                                           | country        | 031      | asi           |
| bgd   | Bangladesh                                           | country        | 050      | asi           |
| bhr   | Bahrain                                              | country        | 048      | asi           |
| brn   | Brunei Darussalam                                    | country        | 096      | asi           |
| btn   | Bhutan                                               | country        | 064      | asi           |
| chn   | China                                                | country        | 156      | asi           |
| cyp   | Cyprus                                               | country        | 196      | asi           |
| geo   | Georgia                                              | country        | 268      | asi           |
| idn   | Indonesia                                            | country        | 360      | asi           |
| irq   | Iraq                                                 | country        | 368      | asi           |
| ind   | India                                                | country        | 356      | asi           |
| irn   | Iran (Islamic Republic of)                           | country        | 364      | asi           |
| isr   | Israel                                               | country        | 376      | asi           |
| jor   | Jordan                                               | country        | 400      | asi           |
| jpn   | Japan                                                | country        | 392      | asi           |
| kaz   | Kazakhstan                                           | country        | 398      | asi           |
| kgz   | Kyrgyzstan                                           | country        | 417      | asi           |
| khm   | Cambodia                                             | country        | 116      | asi           |
| kwt   | Kuwait                                               | country        | 414      | asi           |
| kor   | Republic of Korea                                    | country        | 410      | asi           |
| lao   | Lao People's Democratic Republic                     | country        | 418      | asi           |
| lbn   | Lebanon                                              | country        | 422      | asi           |
| lka   | Sri Lanka                                            | country        | 144      | asi           |
| mdv   | Maldives                                             | country        | 462      | asi           |
| mmr   | Myanmar                                              | country        | 104      | asi           |
| mng   | Mongolia                                             | country        | 496      | asi           |
| mys   | Malaysia                                             | country        | 458      | asi           |
| npl   | Nepal                                                | country        | 524      | asi           |
| omn   | Oman                                                 | country        | 512      | asi           |
| pak   | Pakistan                                             | country        | 586      | asi           |
| phl   | Philippines                                          | country        | 608      | asi           |
| sau   | Saudi Arabia                                         | country        | 682      | asi           |
| prk   | Democratic People's Republic of Korea                | country        | 408      | asi           |
| qat   | Qatar                                                | country        | 634      | asi           |
| sgp   | Singapore                                            | country        | 702      | asi           |
| syr   | Syrian Arab Republic                                 | country        | 760      | asi           |
| tha   | Thailand                                             | country        | 764      | asi           |
| tjk   | Tajikistan                                           | country        | 762      | asi           |
| tkm   | Turkmenistan                                         | country        | 795      | asi           |
| tls   | Timor-Leste                                          | country        | 626      | asi           |
| tur   | Türkiye                                              | country        | 792      | asi           |
| uzb   | Uzbekistan                                           | country        | 860      | asi           |
| vnm   | Viet Nam                                             | country        | 704      | asi           |
| yem   | Yemen                                                | country        | 887      | asi           |
| afr   | Africa                                               | region         | 2        |               |
| ago   | Angola                                               | country        | 024      | afr           |
| bdi   | Burundi                                              | country        | 108      | afr           |
| ben   | Benin                                                | country        | 204      | afr           |
| bfa   | Burkina Faso                                         | country        | 854      | afr           |
| bwa   | Botswana                                             | country        | 072      | afr           |
| caf   | Central African Republic                             | country        | 140      | afr           |
| civ   | Côte d'Ivoire                                        | country        | 384      | afr           |
| cmr   | Cameroon                                             | country        | 120      | afr           |
| com   | Comoros                                              | country        | 174      | afr           |
| cod   | Democratic Republic of the Congo                     | country        | 180      | afr           |
| cog   | Congo                                                | country        | 178      | afr           |
| cpv   | Cabo Verde                                           | country        | 132      | afr           |
| dji   | Djibouti                                             | country        | 262      | afr           |
| dza   | Algeria                                              | country        | 012      | afr           |
| egy   | Egypt                                                | country        | 818      | afr           |
| eri   | Eritrea                                              | country        | 232      | afr           |
| eth   | Ethiopia                                             | country        | 231      | afr           |
| gab   | Gabon                                                | country        | 266      | afr           |
| gha   | Ghana                                                | country        | 288      | afr           |
| gin   | Guinea                                               | country        | 324      | afr           |
| gmb   | Gambia                                               | country        | 270      | afr           |
| gnb   | Guinea-Bissau                                        | country        | 624      | afr           |
| gnq   | Equatorial Guinea                                    | country        | 226      | afr           |
| ken   | Kenya                                                | country        | 404      | afr           |
| mar   | Morocco                                              | country        | 504      | afr           |
| lbr   | Liberia                                              | country        | 430      | afr           |
| lby   | Libya                                                | country        | 434      | afr           |
| lso   | Lesotho                                              | country        | 426      | afr           |
| mdg   | Madagascar                                           | country        | 450      | afr           |
| mli   | Mali                                                 | country        | 466      | afr           |
| moz   | Mozambique                                           | country        | 508      | afr           |
| mrt   | Mauritania                                           | country        | 478      | afr           |
| mwi   | Malawi                                               | country        | 454      | afr           |
| nam   | Namibia                                              | country        | 516      | afr           |
| ner   | Niger                                                | country        | 562      | afr           |
| nga   | Nigeria                                              | country        | 566      | afr           |
| rwa   | Rwanda                                               | country        | 646      | afr           |
| sdn   | Sudan                                                | country        | 729      | afr           |
| sen   | Senegal                                              | country        | 686      | afr           |
| sle   | Sierra Leone                                         | country        | 694      | afr           |
| som   | Somalia                                              | country        | 706      | afr           |
| ssd   | South Sudan                                          | country        | 728      | afr           |
| stp   | Sao Tome and Principe                                | country        | 678      | afr           |
| swz   | Eswatini                                             | country        | 748      | afr           |
| syc   | Seychelles                                           | country        | 690      | afr           |
| tcd   | Chad                                                 | country        | 148      | afr           |
| tgo   | Togo                                                 | country        | 768      | afr           |
| tun   | Tunisia                                              | country        | 788      | afr           |
| tza   | United Republic of Tanzania                          | country        | 834      | afr           |
| uga   | Uganda                                               | country        | 800      | afr           |
| zaf   | South Africa                                         | country        | 710      | afr           |
| zmb   | Zambia                                               | country        | 894      | afr           |
| zwe   | Zimbabwe                                             | country        | 716      | afr           |
| mus   | Mauritius                                            | country        | 480      | afr           |
| eur   | Europe                                               | region         | 150      |               |
| alb   | Albania                                              | country        | 008      | eur           |
| and   | Andorra                                              | country        | 020      | eur           |
| aut   | Austria                                              | country        | 040      | eur           |
| bel   | Belgium                                              | country        | 056      | eur           |
| cze   | Czechia                                              | country        | 203      | eur           |
| bgr   | Bulgaria                                             | country        | 100      | eur           |
| bih   | Bosnia and Herzegovina                               | country        | 070      | eur           |
| blr   | Belarus                                              | country        | 112      | eur           |
| che   | Switzerland                                          | country        | 756      | eur           |
| mda   | Republic of Moldova                                  | country        | 498      | eur           |
| deu   | Germany                                              | country        | 276      | eur           |
| dnk   | Denmark                                              | country        | 208      | eur           |
| est   | Estonia                                              | country        | 233      | eur           |
| fin   | Finland                                              | country        | 246      | eur           |
| fra   | France                                               | country        | 250      | eur           |
| gbr   | United Kingdom of Great Britain and Northern Ireland | country        | 826      | eur           |
| grc   | Greece                                               | country        | 300      | eur           |
| hrv   | Croatia                                              | country        | 191      | eur           |
| hun   | Hungary                                              | country        | 348      | eur           |
| isl   | Iceland                                              | country        | 352      | eur           |
| irl   | Ireland                                              | country        | 372      | eur           |
| ita   | Italy                                                | country        | 380      | eur           |
| mco   | Monaco                                               | country        | 492      | eur           |
| lie   | Liechtenstein                                        | country        | 438      | eur           |
| ltu   | Lithuania                                            | country        | 440      | eur           |
| lux   | Luxembourg                                           | country        | 442      | eur           |
| lva   | Latvia                                               | country        | 428      | eur           |
| mkd   | North Macedonia                                      | country        | 807      | eur           |
| mlt   | Malta                                                | country        | 470      | eur           |
| mne   | Montenegro                                           | country        | 499      | eur           |
| nld   | Kingdom of the Netherlands                           | country        | 528      | eur           |
| rus   | Russian Federation                                   | country        | 643      | eur           |
| nor   | Norway                                               | country        | 578      | eur           |
| rou   | Romania                                              | country        | 642      | eur           |
| pol   | Poland                                               | country        | 616      | eur           |
| smr   | San Marino                                           | country        | 674      | eur           |
| srb   | Serbia                                               | country        | 688      | eur           |
| svk   | Slovakia                                             | country        | 703      | eur           |
| svn   | Slovenia                                             | country        | 705      | eur           |
| swe   | Sweden                                               | country        | 752      | eur           |
| ukr   | Ukraine                                              | country        | 804      | eur           |
| vat   | Holy See                                             | country        | 336      | eur           |
| esp   | Spain                                                | country        | 724      | eur           |
| prt   | Portugal                                             | country        | 620      | eur           |
| ame_s | South America                                        | region         | 5        |               |
| ame_n | North America                                        | region         | 3        |               |
| arg   | Argentina                                            | country        | 032      | ame_s         |
| atg   | Antigua and Barbuda                                  | country        | 028      | ame_n         |
| bhs   | Bahamas                                              | country        | 044      | ame_n         |
| blz   | Belize                                               | country        | 084      | ame_n         |
| bol   | Bolivia (Plurinational State of)                     | country        | 068      | ame_s         |
| bra   | Brazil                                               | country        | 076      | ame_s         |
| brb   | Barbados                                             | country        | 052      | ame_n         |
| can   | Canada                                               | country        | 124      | ame_n         |
| chl   | Chile                                                | country        | 152      | ame_s         |
| col   | Colombia                                             | country        | 170      | ame_s         |
| cri   | Costa Rica                                           | country        | 188      | ame_n         |
| cub   | Cuba                                                 | country        | 192      | ame_n         |
| dma   | Dominica                                             | country        | 212      | ame_n         |
| dom   | Dominican Republic                                   | country        | 214      | ame_n         |
| grd   | Grenada                                              | country        | 308      | ame_n         |
| gtm   | Guatemala                                            | country        | 320      | ame_n         |
| guy   | Guyana                                               | country        | 328      | ame_s         |
| hnd   | Honduras                                             | country        | 340      | ame_n         |
| hti   | Haiti                                                | country        | 332      | ame_n         |
| jam   | Jamaica                                              | country        | 388      | ame_n         |
| kna   | Saint Kitts and Nevis                                | country        | 659      | ame_n         |
| lca   | Saint Lucia                                          | country        | 662      | ame_n         |
| mex   | Mexico                                               | country        | 484      | ame_n         |
| nic   | Nicaragua                                            | country        | 558      | ame_n         |
| pan   | Panama                                               | country        | 591      | ame_n         |
| per   | Peru                                                 | country        | 604      | ame_s         |
| pry   | Paraguay                                             | country        | 600      | ame_s         |
| slv   | El Salvador                                          | country        | 222      | ame_n         |
| sur   | Suriname                                             | country        | 740      | ame_s         |
| tto   | Trinidad and Tobago                                  | country        | 780      | ame_n         |
| ury   | Uruguay                                              | country        | 858      | ame_s         |
| vct   | Saint Vincent and the Grenadines                     | country        | 670      | ame_n         |
| ven   | Venezuela (Bolivarian Republic of)                   | country        | 862      | ame_s         |
| ecu   | Ecuador                                              | country        | 218      | ame_s         |
| usa   | United States of America                             | country        | 840      | ame_n         |
| oce   | Australia and Oceania                                | region         | 9        |               |
| aus   | Australia                                            | country        | 036      | oce           |
| cok   | Cook Islands                                         | country        | 184      | oce           |
| fji   | Fiji                                                 | country        | 242      | oce           |
| fsm   | Micronesia (Federated States of)                     | country        | 583      | oce           |
| kir   | Kiribati                                             | country        | 296      | oce           |
| mhl   | Marshall Islands                                     | country        | 584      | oce           |
| wsm   | Samoa                                                | country        | 882      | oce           |
| niu   | Niue                                                 | country        | 570      | oce           |
| nzl   | New Zealand                                          | country        | 554      | oce           |
| nru   | Nauru                                                | country        | 520      | oce           |
| plw   | Palau                                                | country        | 585      | oce           |
| png   | Papua New Guinea                                     | country        | 598      | oce           |
| slb   | Solomon Islands                                      | country        | 090      | oce           |
| tuv   | Tuvalu                                               | country        | 798      | oce           |
| ton   | Tonga                                                | country        | 776      | oce           |
| vut   | Vanuatu                                              | country        | 548      | oce           |


