# path
####path generator
###About path
path is a path generator in js.  It will generate a random path from the bottom left corner to the top right corner of a variable size grid.  The placements of the start and end points are just arbitrary and the path does not depend on them.  The generator will avoid going outside the area of the grid and will place larger rooms along the way as well.

If the grid size is large enough, the path generator will create divergent solo paths as well.  These extra routes will avoid reinteresting with the main path and each other.  They can also contain larger rooms.

###How to use path
* Select the desired grid width
* Select the desired grid height
* Click paint
