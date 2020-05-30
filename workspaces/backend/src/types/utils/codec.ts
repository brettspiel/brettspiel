import { Codec, string, Either, Left, Right } from "purify-ts";

const extendCodec = <T>(
  base: Codec<T>,
  decoder: (value: T) => Either<string, T>
): Codec<T> =>
  Codec.custom<T>({
    decode: (value) => base.decode(value).chain(decoder as any),
    encode: base.encode,
  });

export const NonEmptyString = extendCodec<string>(string, (value) =>
  value === "" ? Left("value must not be empty") : Right(value)
);

export const FixedLengthString = (length: number) =>
  extendCodec<string>(string, (value) =>
    value.length !== length
      ? Left(`value must have length ${length}`)
      : Right(value)
  );

export type RangeOption = {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
};
export const RangedLengthString = ({ gt, gte, lt, lte }: RangeOption) =>
  extendCodec<string>(string, (value) => {
    if (gt != null && !(gt < value.length))
      return Left(`value must has length greater than ${gt}`);
    if (gte != null && !(gte <= value.length))
      return Left(`value must has length greater than equal ${gte}`);
    if (lt != null && !(value.length < lt))
      return Left(`values must has length less than ${lt}`);
    if (lte != null && !(value.length <= lte))
      return Left(`value must has length less than equal ${lte}`);

    return Right(value);
  });

export const UuidV4 = extendCodec<string>(
  FixedLengthString(32 + 4),
  (value) => {
    const sp = value.split("-");
    if (sp.length !== 5) return Left(`UUID v4 must have 5 segments`);
    if (sp[0].length !== 8)
      return Left(`1st segment of UUID v4 must have exact length 8`);
    if (sp[1].length !== 4)
      return Left(`2nd segment of UUID v4 must have exact length 4`);
    if (sp[2].length !== 4)
      return Left(`3rd segment of UUID v4 must have exact length 4`);
    if (sp[3].length !== 4)
      return Left(`4th segment of UUID v4 must have exact length 4`);
    if (sp[4].length !== 12)
      return Left(`last segment of UUID v4 must have exact length 12`);

    const isValidChars = sp.every((segment) =>
      Array.from(segment).every((s) => !Number.isNaN(Number.parseInt(s, 16)))
    );
    if (!isValidChars) return Left(`all segment must consist with hex chars`);

    return Right(value);
  }
);
