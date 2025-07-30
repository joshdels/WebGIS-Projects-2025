import geopandas as gpd

contour = gpd.read_file("data/Contour_2m.json")
contour = contour.to_crs(4326)
contour.to_file("data/contour_geopands.geojson", driver="GeoJSON")
