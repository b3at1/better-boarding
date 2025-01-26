import numpy as np
import json


NUM_ROWS = 18
NUM_COLS = 6


SITTING_DELAYS = [1, 7, 11]
LUGGAGE_DELAY = 10
WALKING_DELAY = 1


seats = np.zeros((NUM_ROWS, NUM_COLS), dtype=int)
num_families = 10


def generate_families() -> np.ndarray:
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


def randomize_elements_in_list(lst: list[int]) -> list[int]:
    return np.random.permutation(lst).tolist()


# def create_individual(num_families: int, num_boarding_groups: int) -> list[int]:
#     boarding_groups = []
#     for family in range(num_families):
#         boarding_groups.append(np.random.randint(0, num_boarding_groups))
#     return boarding_groups


# def create_population(num_families: int, num_boarding_groups: int, population_size: int) -> list[list[int]]:
#     individuals = []
#     for _ in range(population_size):
#         individuals.append(create_individual(num_families, num_boarding_groups))
#     return individuals


def create_individual(num_families: int, num_boarding_groups: int) -> np.ndarray[int]:
    return np.random.randint(0, num_boarding_groups, size=num_families)


def create_population(num_families: int, num_boarding_groups: int, population_size: int) -> np.ndarray[int]:
    return np.random.randint(0, num_boarding_groups, size=(population_size, num_families))






def simulate(randomized_family_ordering: list[list[int]]) -> float:
    pass


def main():
    print("test")
    print(create_population(10, 4, 3))


if __name__ == "__main__":
    main()