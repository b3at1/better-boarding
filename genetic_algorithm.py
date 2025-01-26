import numpy as np
import json

class Person:
    def __init__(self, person_id: int, family_id: int, boarding_number: int, seat: tuple[int, int]) -> None:
        self.person_id = person_id
        self.family_id = family_id
        self.boarding_number = boarding_number
        self.seat = seat
    def __repr__(self):
        return f"{self.seat}"

class Family:
    def __init__(self, family_id: int, boarding_number: int, people: list[Person]) -> None:
        self.family_id = family_id
        self.boarding_number = boarding_number
        self.people = people
    def __repr__(self):
        return f"Family {self.family_id} boarding # {self.boarding_number} people {self.people.__str__()}"
        

POPULATION_SIZE = 2

NUM_ROWS = 18
NUM_COLS = 6
TOTAL_PEOPLE = NUM_ROWS * NUM_COLS


SITTING_DELAYS = [1, 7, 11]
LUGGAGE_DELAY = 10

def main():
    orig_families = get_families(magic_get_seating_grid())
    print(np.array(orig_families))
    population = []

def magic_get_seating_grid() -> np.ndarray:
    return [
        [12, 45, 3, 27, 8, 60],
        [34, 18, 22, 50, 9, 41],
        [7, 55, 1, 39, 28, 13],
        [6, 14, 44, 58, 23, 37],
        [10, 2, 30, 17, 53, 49],
        [19, 5, 36, 25, 31, 59],
        [16, 21, 4, 43, 47, 54],
        [42, 26, 48, 20, 33, 56],
        [11, 38, 46, 15, 40, 57],
        [24, 35, 32, 29, 52, 51],
        [9, 7, 13, 50, 3, 45],
        [16, 27, 12, 6, 30, 22],
        [39, 18, 10, 34, 41, 28],
        [5, 23, 19, 55, 44, 14],
        [8, 2, 53, 31, 37, 49],
        [36, 1, 58, 42, 21, 47],
        [4, 25, 33, 54, 26, 20],
        [11, 40, 48, 15, 32, 56]
    ]

# boarding numbers are NOT initialized in this function
def get_families(input_grid: list[list[int]]) -> list[Family]:
    family_ids = set()
    for row in input_grid:
        for f in row:
            family_ids.add(f)
    family_ids = {poopy : i for i, poopy in enumerate(list(family_ids))}
    families = [Family(i, -1, []) for poopy, i in family_ids.items()]
    for i in range(len(input_grid)):
        for j in range(len(input_grid[i])):
            person = Person(i * NUM_COLS + j, family_ids[input_grid[i][j]], -1, (i, j))
            families[family_ids[input_grid[i][j]]].people.append(person)
    return families


def get_individual() -> list[Family]:
    seating = magic_get_seating_grid()
    families = []
    for i in range(len(seating)):
        boarding_number = i % 3
        family = Family(i, boarding_number, [])
        for j in range(len(seating[i])):
            person = Person(i * NUM_COLS + j, i, boarding_number, (i, j))
            family.people.append(person)
        families.append(family)
    return families

# POPULATION
# INDIVIDUAL: 
    # Each individual is a list of families
    # sort each individual by boarding number
        # Each family is a list of people
        # Sort the people of each family by seat



# FITNESS FUNCTION
# Given the queue of people in the order they board the plane, calculate total time taken to board the plane
# Calculate the time taken to board the plane
    # Simulate the boarding process with positions of people at each point in time
    # Create a list of time penalties, each person has a time penalty
    # If person has a time penalty > 0, they are not allowed to move, decrement time penalty by 1 each turn
    # If person has a time penalty = 0, they are allowed to move unless if they are blocked by another person

# Time penalties
penalties = np.zeros((TOTAL_PEOPLE))

# check if person has seat in current row
def has_seat_in_row(person: Person, row: int) -> bool:
    return person.seat[0] == row

def fitness_function(individual: list[Family], queue: list[Person]) -> int:
    pass



if __name__ == "__main__":
    main()