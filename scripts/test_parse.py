from ingredient_parser import parse_measure

print('1/4 cup ->', parse_measure('1/4 cup','sugar'))
print('1/2 cup ->', parse_measure('1/2 cup','sugar'))
print('1 cup ->', parse_measure('1 cup','sugar'))
print('2 cups ->', parse_measure('2 cups','sugar'))
print("fraction fallback test: '1 1/2 cup' ->", parse_measure('1 1/2 cup','sugar'))
