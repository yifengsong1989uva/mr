#!/usr/bin/env Rscript

## libraries
libs <- c('tidyverse', 'geojsonio')
lapply(libs, require, character.only = TRUE)

## paths
ddir <- '../data'
rdir <- file.path(ddir, '_raw')

## read in school data
df <- read_csv(file.path(rdir, 'HD2015.zip')) %>%
    setNames(tolower(names(.))) %>%
    select(instnm, fips, sector, lon = longitud, lat = latitude) %>%
    filter(sector %in% c(1:6)) %>%
    mutate(lon = as.numeric(lon),
           lat = as.numeric(lat),
           id = row_number(),
           fips = ) %>%
    na.omit()

## write as geojson
geojson_write(input = df %>%
                  select(id, lon, lat),
              lat = 'lat', lon = 'lon',
              file = file.path(ddir, 'schools.geojson'))

write_tsv(df %>%
          select(id, name = instnm, fips, sector),
          path = file.path(ddir, 'schools.tsv'))
