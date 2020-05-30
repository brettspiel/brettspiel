import "jest";
import { FixedLengthString, NonEmptyString, RangedLengthString } from "./codec";
import { Left, Right } from "purify-ts/es";

const LeftValue = Left(expect.any(String));

describe("NonEmptyString", () => {
  it("should return Right value when input is non-empty string", () => {
    expect(NonEmptyString.decode("non-empty")).toEqual(Right("non-empty"));
  });

  it("should return Left when input is empty string", () => {
    expect(NonEmptyString.decode("")).toEqual(LeftValue);
  });

  it("should return Left when input is non-string", () => {
    expect(NonEmptyString.decode(10)).toEqual(LeftValue);
  });
});

describe("FixedLengthString", () => {
  it("should return Right value when input string has fixed length", () => {
    expect(FixedLengthString(5).decode("12345")).toEqual(Right("12345"));
  });

  it("should return Left when length of input string is not equal to argument number", () => {
    expect(FixedLengthString(5).decode("1234")).toEqual(LeftValue);
  });

  it("should return Left when input is non-string", () => {
    expect(FixedLengthString(5).decode(123)).toEqual(LeftValue);
  });
});
