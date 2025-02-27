// create a function to validate the dialect of the localStorage dialect is in this list of dialects
export function validateLanguage(language: string): boolean {
  const dialects = [
    "es-AR",
    "es-BO",
    "es-CL",
    "es-CO",
    "es-CR",
    "es-EC",
    "es-SV",
    "es-ES",
    "es-US",
    "es-GT",
    "es-HN",
    "es-MX",
    "es-NI",
    "es-PA",
    "es-PY",
    "es-PE",
    "es-PR",
    "es-DO",
    "es-UY",
    "es-VE",
    "en-AU",
    "en-CA",
    "en-IN",
    "en-NZ",
    "en-ZA",
    "en-GB",
    "en-US",
  ];
  if (dialects.includes(language)) {
    return true;
  } else {
    return false;
  }
}
