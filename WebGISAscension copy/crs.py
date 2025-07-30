<<<<<<< HEAD
import geopandas as gpd

contour = gpd.read_file("data/Contour_2m.json")
contour = contour.to_crs(4326)
contour.to_file("data/contour_geopands.geojson", driver="GeoJSON")
=======
import geopandas as gpd

contour = gpd.read_file("data/Contour_2m.json")
contour = contour.to_crs(4326)
contour.to_file("data/contour_geopands.geojson", driver="GeoJSON")
>>>>>>> 82db7ac4e1cba6022d4b0015897a700dffb97fd9
