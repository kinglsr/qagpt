import * as React from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

interface LangDropdownProps {}

type LanguageItem = string | [string, string];

interface LanguageEntry {
  language: string;
  dialects: LanguageItem[];
}

const LangDropdown: React.FC<LangDropdownProps> = () => {
  const lang: LanguageEntry[] = [
    {
      language: "English",
      dialects: [
        ["en-AU", "Australia"],
        ["en-CA", "Canada"],
        ["en-IN", "India"],
        ["en-NZ", "New Zealand"],
        ["en-ZA", "South Africa"],
        ["en-GB", "United Kingdom"],
        ["en-US", "United States"],
        // ... other dialects
      ],
    },
    {
      language: "Español",
      dialects: [
        ["es-AR", "Argentina"],
        ["es-BO", "Bolivia"],
        ["es-CL", "Chile"],
        ["es-CO", "Colombia"],
        ["es-CR", "Costa Rica"],
        ["es-EC", "Ecuador"],
        ["es-SV", "El Salvador"],
        ["es-ES", "España"],
        ["es-US", "Estados Unidos"],
        ["es-GT", "Guatemala"],
        ["es-HN", "Honduras"],
        ["es-MX", "México"],
        ["es-NI", "Nicaragua"],
        ["es-PA", "Panamá"],
        ["es-PY", "Paraguay"],
        ["es-PE", "Perú"],
        ["es-PR", "Puerto Rico"],
        ["es-DO", "República Dominicana"],
        ["es-UY", "Uruguay"],
        ["es-VE", "Venezuela"],
        // ... other dialects
      ],
    },
    {
      language: "తెలుగు",
      dialects: [["te-IN", "India"]],
    },
  ];

  const [selectedMainKey, setSelectedMainKey] = React.useState("English");
  const [selectedCountry, setSelectedCountry] = React.useState("United States");
  const [selectedDialect, setSelectedDialect] = React.useState("en-US");

  React.useEffect(() => {
    localStorage.setItem("dialect", selectedDialect);
  }, [selectedDialect]);

  const handleMainKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const mainKey = event.target?.value;
    if (mainKey) {
      setSelectedMainKey(mainKey);
      updateDialect(mainKey, selectedCountry);
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const country = event.target?.value;
    setSelectedCountry(country);
    updateDialect(selectedMainKey, country);
  };

  const updateDialect = (mainKey: string, country: string) => {
    const selectedDialect = lang
      .find((entry) => entry.language === mainKey)
      ?.dialects.find((dialect) => dialect[1] === country)?.[0];

    if (selectedDialect) {
      setSelectedDialect(selectedDialect);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Select
        onValueChange={(value: string) =>
          handleMainKeyChange({
            target: { value },
          } as React.ChangeEvent<HTMLSelectElement>)
        }
        defaultValue={selectedMainKey}
      >
        <SelectTrigger className="body-regular light-border background-light800_dark300 text-dark500_light700 mr-5 border px-5 py-2.5">
          <SelectValue placeholder="English" />
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {lang.map((entry) => (
              <SelectItem
                key={entry.language}
                value={entry.language}
                className="cursor-pointer"
              >
                {entry.language}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <br />

      <Select
        onValueChange={(value: string) =>
          handleCountryChange({
            target: { value },
          } as React.ChangeEvent<HTMLSelectElement>)
        }
        defaultValue={selectedCountry}
      >
        <SelectTrigger className="body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5">
          {" "}
          <SelectValue placeholder="USA" />
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {lang
              .find((entry) => entry.language === selectedMainKey)
              ?.dialects.map((dialect) => (
                <SelectItem
                  key={dialect[1]}
                  value={dialect[1]}
                  className="cursor-pointer"
                >
                  {dialect[1]}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LangDropdown;
