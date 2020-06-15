import { Either } from "purify-ts";

export function sequence<L, R1>(e1: Either<L, R1>): Either<L, [R1]>;
export function sequence<L, R1, R2>(
  e1: Either<L, R1>,
  e2: Either<L, R2>
): Either<L, [R1, R2]>;
export function sequence<L, R1, R2, R3>(
  e1: Either<L, R1>,
  e2: Either<L, R2>,
  e3: Either<L, R3>
): Either<L, [R1, R2, R3]>;
export function sequence<L, R1, R2, R3, R4>(
  e1: Either<L, R1>,
  e2: Either<L, R2>,
  e3: Either<L, R3>,
  e4: Either<L, R4>
): Either<L, [R1, R2, R3, R4]>;
export function sequence<L, R1, R2, R3, R4, R5>(
  e1: Either<L, R1>,
  e2: Either<L, R2>,
  e3: Either<L, R3>,
  e4: Either<L, R4>,
  e5: Either<L, R5>
): Either<L, [R1, R2, R3, R4, R5]>;
export function sequence<L, R1, R2, R3, R4, R5, R6>(
  e1: Either<L, R1>,
  e2: Either<L, R2>,
  e3: Either<L, R3>,
  e4: Either<L, R4>,
  e5: Either<L, R5>,
  e6: Either<L, R6>
): Either<L, [R1, R2, R3, R4, R5, R6]>;
export function sequence<L, R1, R2, R3, R4, R5, R6, R7>(
  e1: Either<L, R1>,
  e2: Either<L, R2>,
  e3: Either<L, R3>,
  e4: Either<L, R4>,
  e5: Either<L, R5>,
  e6: Either<L, R6>,
  e7: Either<L, R7>
): Either<L, [R1, R2, R3, R4, R5, R6, R7]>;
export function sequence<L, R1, R2, R3, R4, R5, R6, R7, R8>(
  e1: Either<L, R1>,
  e2: Either<L, R2>,
  e3: Either<L, R3>,
  e4: Either<L, R4>,
  e5: Either<L, R5>,
  e6: Either<L, R6>,
  e7: Either<L, R7>,
  e8: Either<L, R8>
): Either<L, [R1, R2, R3, R4, R5, R6, R7, R8]>;
export function sequence<L, R1, R2, R3, R4, R5, R6, R7, R8, R9>(
  e1: Either<L, R1>,
  e2: Either<L, R2>,
  e3: Either<L, R3>,
  e4: Either<L, R4>,
  e5: Either<L, R5>,
  e6: Either<L, R6>,
  e7: Either<L, R7>,
  e8: Either<L, R8>,
  e9: Either<L, R9>
): Either<L, [R1, R2, R3, R4, R5, R6, R7, R8, R9]>;
export function sequence<L, R1, R2, R3, R4, R5, R6, R7, R8, R9>(
  ...eithers: Either<L, R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 | R9>[]
):
  | Either<L, [R1]>
  | Either<L, [R1, R2]>
  | Either<L, [R1, R2, R3]>
  | Either<L, [R1, R2, R3, R4]>
  | Either<L, [R1, R2, R3, R4, R5]>
  | Either<L, [R1, R2, R3, R4, R5, R6]>
  | Either<L, [R1, R2, R3, R4, R5, R6, R7]>
  | Either<L, [R1, R2, R3, R4, R5, R6, R7, R8]>
  | Either<L, [R1, R2, R3, R4, R5, R6, R7, R8, R9]> {
  const results = [];

  for (const either of eithers) {
    if (either.isLeft()) {
      return either;
    } else {
      results.push(either.unsafeCoerce());
    }
  }

  return results as any;
}
