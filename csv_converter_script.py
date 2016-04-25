# A script to convert city,state to lat,long format
from geopy.geocoders import Nominatim
import csv

geolocator = Nominatim()

file1 = open('marathons.csv', 'r')
file2 = open("output.csv", 'w' , newline='')
reader = csv.reader(file1)
writer = csv.writer(file2)
print(next(reader))
writer.writerow(["date", "name", "city", "state", "longitude", "latitude", "run_types"])

for row in reader:
	print(row)
	extracted_values = [x.strip() for x in row[2].split(',')]
	(city, state) = (extracted_values[0], extracted_values[1])
	location = geolocator.geocode(row[2])
	writer.writerow([row[0], row[1], city, state, location.longitude, location.latitude, row[3]])
