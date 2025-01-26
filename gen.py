import numpy as np
import json
import copy as COPY

from flask import Flask, request, jsonify

app = Flask(__name__)


NUM_GENERATIONS = 3
NUM_MUTATIONS_PER_GENERATION = 2
POPULATION_SIZE = 100

NUM_BOARDING_NUMBERS = 5

NUM_ROWS = 18
NUM_COLS = 6
TOTAL_PEOPLE = NUM_ROWS * NUM_COLS


SITTING_DELAYS = [1, 7, 11]
LUGGAGE_DELAY = 10
best_time = float("inf")
family_grid = []


async def process_data(data):
    global family_grid
    global best_time
    # Example processing step (you would implement your logic here)
    family_grid = data
    best_time = float("inf")
    population = generate_population()
    for i in range(NUM_GENERATIONS):
        population = evolve(population)
        simulate_population(population)
        
    print(get_boarding_number_grid(population[0]))
    
    processed_data = [
        get_boarding_number_grid(population[0]),
        best_time
    ]

    # Return the processed data
    return processed_data


class Person:
    def __init__(self, person_id: int, family_id: int, boarding_number: int, seat: tuple[int, int], penalty: int = 0) -> None:
        self.person_id = person_id
        self.family_id = family_id
        self.boarding_number = boarding_number
        self.seat = seat
        self.penalty = penalty
    def __repr__(self):
        return f"{self.family_id} {self.seat}"

class Family:
    def __init__(self, family_id: int, boarding_number: int, people: list[Person]) -> None:
        self.family_id = family_id
        self.boarding_number = boarding_number
        self.people = people
    def __repr__(self):
        # return f"Family {self.family_id} boarding #{self.boarding_number}, {self.people.__str__()}"
        return ""
        
        
def main():
    # # orig_families = get_families(magic_get_seating_grid())
    # # new_families = generate_individual_family(orig_families)
    # # people_queue = generate_queue(new_families)
    # population = generate_population(magic_get_seating_grid())
    # # time = simulate(people_queue)
    # # time = simulate(generate_queue(population[0]))
    # # print(population)
    # # print(time)
    
    # for i in range(NUM_GENERATIONS):
    #     population = evolve(population)
    #     print(simulate_population(population))
    #     print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    #     print()
        
    # print(get_boarding_number_grid(population[0]))
    process_data(json.dumps(magic_get_seating_grid()))
    
    

def magic_get_seating_grid() -> list[list[int]]:
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


def json_to_2d_list(json_obj: str) -> list[list[int]]:
    data = json.loads(json_obj)
    return data

def list_2d_to_json(input_list: list[list[int]]) -> str:
    return json.dumps(input_list)


# boarding numbers are NOT initialized in this function
def get_families() -> list[Family]:
    family_ids = set()
    for row in family_grid:
        for f in row:
            family_ids.add(f)
    family_ids = {poopy : i for i, poopy in enumerate(list(family_ids))}
    families = [Family(i, -1, []) for poopy, i in family_ids.items()]
    for i in range(len(family_grid)):
        for j in range(len(family_grid[i])):
            person = Person(i * NUM_COLS + j, family_ids[family_grid[i][j]], -1, (i, j))
            families[family_ids[family_grid[i][j]]].people.append(person)
    for family in families:
        # sort people by seat, first by row, then by column. However, the column should be in the order 0, 5, 1, 4, 2, 3
        family.people.sort(key=lambda x: (x.seat[0], -abs(x.seat[1] - 3)))
    return families


def generate_individual_family(families: list[Family]) -> list[Family]:
    # for each family, randomly assign a boarding number
    # sort families by boarding number
    family_copy = families.copy()
    for family in family_copy:
        family.boarding_number = np.random.randint(0, NUM_BOARDING_NUMBERS)
    family_copy.sort(key=lambda x: -x.boarding_number)
    return family_copy

def generate_queue(families: list[Family]) -> list[Person]:
    # add families to queue in decreasing order of boarding number
    queue = []
    for family in families:
        queue.extend(family.people)
    queue.extend([None] * 18)
    return queue
    
def generate_population() -> list[list[Family]]:
    population = []
    for i in range(POPULATION_SIZE):
        population.append(generate_individual_family(get_families()))
    return population
    
    

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

def step(queue: list[Person], is_seated_grid: list[list[bool]]) -> bool:
    # for each person in queue, if they are not blocked by another person, move them to their seat
    # if they are blocked by another person, decrement their time penalty by 1
    # if their time penalty is 0, they are allowed to move again
    # if their time penalty is > 0, they are not allowed to move
    # if a person has a time penalty of 0 and is not blocked by another person, they will move to their seat
    # if a person has a time penalty of 0 and is blocked by another person, they will not move
    # if a person has a time penalty of > 0 and is not blocked by another person, they will not move
    # if a person has a time penalty of > 0 and is blocked by another person, they will not move

    # for each row in the plane, check if there are any people in that row who have a time penalty of 0 and are not blocked by another person
    # if there are, move them to their seat in that row
    # if there are no people in that row who have a time penalty of 0 and are not blocked by another person, do nothing

    done = True
    
    for i in range(len(queue) - 1, -1, -1):
        person = queue[i]
        if person is None:
            continue
        
        done = False
        
        # check if person has time penalty > 0. If so, decrement it by 1 and continue to next iteration
        if person.penalty > 0:
            person.penalty -= 1
            continue
        
        # check if the row of the current person has been reached. If so, move them to their seat and continue to next iteration.
        if has_seat_in_row(person, i - TOTAL_PEOPLE):
            queue[i] = None
            is_seated_grid[person.seat[0]][person.seat[1]] = True
            continue
        
        # check if person is blocked by another person. If so, continue to next iteration
        if i < len(queue) - 1 and queue[i + 1] is not None:
            continue
        
        queue[i + 1] = person
        queue[i] = None
        
        if has_seat_in_row(person, i + 1 - TOTAL_PEOPLE):
            person.penalty = get_penalty(person, i + 1 - TOTAL_PEOPLE, is_seated_grid)
            continue
            
    return done

def simulate(queue: list[Person]) -> int:
    is_seated_grid = [[False for _ in range(NUM_COLS)] for _ in range(NUM_ROWS)]
    time = 0
    while not step(queue, is_seated_grid):
        time += 1
    return time

def get_penalty(person: Person, row: int, is_seated_grid: list[list[bool]]) -> int:
    person_column = person.seat[1]
    row_of_seats = is_seated_grid[row]
    
    total_penalty = 0
    sitting_penalty_index = 0
    
    if (person_column >= 3):
        for i in range(3, person_column):
            if (row_of_seats[i] == True):
                sitting_penalty_index += 1
    else:
        for i in range (person_column + 1, 3):
            if (row_of_seats[i] == True):
                sitting_penalty_index += 1
    
    sitting_penalty = SITTING_DELAYS[sitting_penalty_index]
    total_penalty += sitting_penalty
    total_penalty += LUGGAGE_DELAY
    
    return total_penalty

# check if person has seat in current row
def has_seat_in_row(person: Person, row: int) -> bool:
    return person.seat[0] == row

def simulate_population(population: list[list[Family]]) -> list[tuple[list[Family], int]]:
    global best_time
    
    # for each individual in population, simulate the boarding process and return the time taken to board the plane
    times = []
    
    for families in population:
        people_queue = generate_queue(families)
        population = generate_population()
        time = simulate(people_queue)
        times.append((families, time))
        if time < best_time:
            best_time = time
    
    times.sort(key=lambda x: x[1])
    return times

def kill_half(population_fitnesses: list[tuple[list[Family], int]]) -> list[tuple[list[Family], int]]:
    # kill the bottom half of the population
    return population_fitnesses[:len(population_fitnesses) // 2].copy()

def repopulate(population_fitnesses: list[tuple[list[Family], int]]) -> list[list[Family]]:
    # repopulate the population by creating new individuals from the top individuals
    new_population = []
    for i in range(len(population_fitnesses)):
        new_population.append(population_fitnesses[i][0])
        new_population.append(mutate(population_fitnesses[i][0]))
    
    # print("POOOPOOPOOPOPOOOPOOPOOPO")
    # print(new_population[0])
    # print("POOPOOPOOPOOPOOPOOOPOOPOOP")
    # print(new_population[1])
    
    return new_population

def mutate(individual: list[Family]) -> list[Family]:
    # mutate the individual by randomly changing the boarding number of a random family
    copy = COPY.deepcopy(individual)
    for i in range(NUM_MUTATIONS_PER_GENERATION):
        family = np.random.choice(copy)
        family.boarding_number = np.random.randint(0, NUM_BOARDING_NUMBERS)
        
    return copy

def evolve(population: list[list[Family]]) -> list[list[Family]]:
    print("evolve")
    # evolve the population by killing the bottom half and repopulating the top half
    population_fitnesses = simulate_population(population)
    population_fitnesses = kill_half(population_fitnesses)
    return repopulate(population_fitnesses)


def get_boarding_number_grid(families: list[Family]) -> list[list[int]]:
    boarding_number_grid = [[-1 for _ in range(NUM_COLS)] for _ in range(NUM_ROWS)]
    for family in families:
        for person in family.people:
            boarding_number_grid[person.seat[0]][person.seat[1]] = family.boarding_number
    return boarding_number_grid

if __name__ == "__main__":
    main()