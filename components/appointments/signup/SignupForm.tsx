"use client";
import {
  SpCheck,
  SProgress1,
  SProgress2,
  SProgress3,
  SProgress4,
  SProgress5,
} from "@/constants";
import React, { useState } from "react";

const countryList = [
  "Afghanistan",
  "Åland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas (the)",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia (Plurinational State of)",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory (the)",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cayman Islands (the)",
  "Central African Republic (the)",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands (the)",
  "Colombia",
  "Comoros (the)",
  "Congo (the Democratic Republic of the)",
  "Congo (the)",
  "Cook Islands (the)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Côte d'Ivoire",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic (the)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands (the) [Malvinas]",
  "Faroe Islands (the)",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories (the)",
  "Gabon",
  "Gambia (the)",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Holy See (the)",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran (Islamic Republic of)",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea (the Democratic People's Republic of)",
  "Korea (the Republic of)",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic (the)",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands (the)",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia (Federated States of)",
  "Moldova (the Republic of)",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands (the)",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger (the)",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands (the)",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine, State of",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines (the)",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Republic of North Macedonia",
  "Romania",
  "Russian Federation (the)",
  "Rwanda",
  "Réunion",
  "Saint Barthélemy",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin (French part)",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan (the)",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan (Province of China)",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands (the)",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates (the)",
  "United Kingdom of Great Britain and Northern Ireland (the)",
  "United States Minor Outlying Islands (the)",
  "United States of America (the)",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela (Bolivarian Republic of)",
  "Viet Nam",
  "Virgin Islands (British)",
  "Virgin Islands (U.S.)",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const industryList = [
  "Conferences",
  "Tradeshows & Exhibitions",
  "Seminars & Workshops",
  "Careers",
  "Education",
  "Culture & Arts",
  "Celebrations",
  "Sports",
  "Job Fairs",
  "Festivals",
  "Charity",
];

export default function SignupForm() {
  const [isRefferalCode, setIsReferralCode] = useState(false);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });
  };
  const stages = ["stage1", "stage2", "stage3", "stage4", "stage5"];

  // State to track the current paragraph index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Handlers for next and previous
  const handleNext = () => {
    if (currentIndex < stages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div>
      {/* 1st */}
      {currentIndex === 0 && (
        <div className="px-3 lg:px-0 max-w-full lg:max-w-[835px] mt-6 lg:mt-10 mx-auto pb-[100px] ">
          <div className="flex mx-auto justify-center">
            <SProgress1 />
          </div>
          <div className="mt-6 lg:mt-[52px] ">
            <p className="text-black text-[20px] font-semibold w-full text-center">
              Do you have a referral code?
            </p>
            {/* buttons */}
            <div className="w-full flex">
              <div className="flex gap-x-[8px] mt-8 mx-auto ">
                {/* 1st button */}
                <div className="flex flex-col cursor-pointer rounded-[8px] gap-y-[18px] pt-[11px] bg-white border-[1px] border-gray-200 hover:border-indigo-800 w-[100px] h-[100px]">
                  <div className="flex mx-auto">
                    <input
                      type="radio"
                      name="referral"
                      id=""
                      className="text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-600"
                      size={16}
                      onClick={() => setIsReferralCode(false)}
                    />
                  </div>
                  <p className="text-[14px] font-normal text-center">No</p>
                </div>

                {/* 2nd Button */}
                <div className="flex flex-col cursor-pointer rounded-[8px] gap-y-[18px] pt-[11px] bg-white border-[1px] border-gray-200 hover:border-indigo-800 w-[100px] h-[100px]">
                  <div className="flex mx-auto">
                    <input
                      type="radio"
                      name="referral"
                      id=""
                      className="text-indigo-600"
                      size={16}
                      onClick={() => setIsReferralCode(true)}
                    />
                  </div>
                  <p className="text-[14px] font-normal text-center">Yes</p>
                </div>
              </div>
            </div>

            {/* ref code */}
            {isRefferalCode && (
              <div className="mt-6">
                <p>Referral</p>
                <input
                  type="text"
                  placeholder="Enter Referral Code "
                  className=" text-[#1f1f1f] placeholder-black bg-transparent outline-none border-[1px] border-gray-200 hover:border-indigo-600 w-full pl-[10px] py-4 rounded-[6px] mt-3"
                  name=""
                  id=""
                />
              </div>
            )}

            {/* nav buttons */}
            <div className="flex items-center justify-center mx-auto  mt-6 ">
              <button
                onClick={handleNext}
                disabled={currentIndex === stages.length - 1}
                className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-3 px-4 rounded-lg"
              >
                Next
              </button>{" "}
            </div>
          </div>
        </div>
      )}

      {/* 2nd */}
      {currentIndex === 1 && (
        <div className="px-3 lg:px-0 max-w-full lg:max-w-[835px] mt-6 lg:mt-10 mx-auto pb-[100px]  ">
          <p className="w-full lg:w-[835px] font-medium text-center hidden lg:block">
            We need this information to personalize your experience, tailor
            services to your location, and ensure secure account setup.
          </p>
          <p className="w-full lg:w-[835px] font-medium text-center block lg:hidden">
            We ask for your phone number, city, and country to personalize your
            experience, tailor services to your location, and ensure secure
            account setup.
          </p>
          <div className="max-w-full lg:max-w-[458px] mx-auto">
            <div className="flex mx-auto justify-center">
              <SProgress2 />
            </div>
            <div className="mt-6 lg:mt-[52px] ">
              {/* 1st input */}
              <div>
                <p className="text-black text-[14px] ">Phone Nuber</p>
                <div className="flex gap-x-[10px] items-center border-[1px] border-gray-200 hover:border-indigo-600 w-full pl-[10px] py-4 rounded-[6px] mt-3">
                  <p>+234</p>
                  <input
                    type="text"
                    placeholder="Enter Phone Number "
                    className=" text-[#1f1f1f] placeholder-black bg-transparent outline-none "
                    name=""
                    id=""
                  />
                </div>
              </div>

              <div className="mt-[29px]">
                <p className="text-black text-[14px] ">City</p>
                <div className=" border-[1px] border-gray-200 hover:border-indigo-600 w-full pl-[10px] py-4 rounded-[6px] mt-3">
                  <input
                    type="text"
                    placeholder="Enter Your City"
                    className=" text-[#1f1f1f] placeholder-black bg-transparent outline-none "
                    name=""
                    id=""
                  />
                </div>
              </div>

              <div className="mt-[29px]">
                <p className="text-black text-[14px] ">Country</p>
                <div className=" border-[1px] border-gray-200 hover:border-indigo-600 w-full px-[9px] py-[16px] rounded-[6px] mt-3">
                  <select
                    name="country"
                    value=""
                    onChange={handleChange}
                    id=""
                    className="w-full  bg-transparent rounded-md border-[1px] text-black text-base border-none  outline-none "
                  >
                    <option
                      disabled
                      selected
                      value=""
                      className="bg-transparent text-black"
                    >
                      Select Your Country
                    </option>
                    {countryList.map((country) => (
                      <option
                        value={country}
                        className="bg-transparent text-black"
                      >
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* nav buttons */}
              <div className="flex items-center justify-center gap-x-4 mx-auto mt-[52px] ">
                <button
                  onClick={handlePrev}
                  className="text-indigo-500 font-semibold text-base border-[1px] border-indigo-500  py-3 px-4 rounded-lg"
                >
                  Prev
                </button>{" "}
                <button
                  onClick={handleNext}
                  disabled={currentIndex === stages.length - 1}
                  className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-3 px-4 rounded-lg"
                >
                  Next
                </button>{" "}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 3rd */}
      {currentIndex === 2 && (
        <div className="px-3 lg:px-0 max-w-full lg:max-w-[835px] mt-6 lg:mt-10 mx-auto pb-[100px]">
          <p className=" w-full lg:w-[835px] font-medium text-center">
            Your name allows us to personalize communication and also address
            you properly.
          </p>
          <div className="max-w-full lg:max-w-[458px] mx-auto mt-8">
            <div className="flex mx-auto justify-center">
              <SProgress3 />
            </div>
            <div className="mt-6 lg:mt-[52px] ">
              {/* 1st input */}
              <div>
                <p className="text-black text-[14px] ">First Name</p>
                <div className=" gap-x-[10px] border-[1px] border-gray-200 hover:border-indigo-600 w-full pl-[10px] py-4 rounded-[6px] mt-3">
                  <input
                    type="text"
                    placeholder="Enter First Name "
                    className=" text-[#1f1f1f] placeholder-black bg-transparent outline-none "
                    name=""
                    id=""
                  />
                </div>
              </div>

              <div className="mt-[29px]">
                <p className="text-black text-[14px] ">Last Name</p>
                <div className=" border-[1px] border-gray-200 hover:border-indigo-600 w-full pl-[10px] py-4 rounded-[6px] mt-3">
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    className=" text-[#1f1f1f] placeholder-black bg-transparent outline-none "
                    name=""
                    id=""
                  />
                </div>
              </div>

              {/* nav buttons */}
              <div className="flex items-center justify-center gap-x-4 mx-auto mt-[52px] ">
                <button
                  onClick={handlePrev}
                  className="text-indigo-500 font-semibold text-base border-[1px] border-indigo-500  py-3 px-4 rounded-lg"
                >
                  Prev
                </button>{" "}
                <button
                  onClick={handleNext}
                  disabled={currentIndex === stages.length - 1}
                  className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-3 px-4 rounded-lg"
                >
                  Next
                </button>{" "}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4th */}
      {currentIndex === 3 && (
        <div className="px-3 lg:px-0 max-w-full lg:max-w-[835px] mt-6 lg:mt-10 mx-auto  ">
          <p className=" w-full xl:w-[835px] text-[14px] lg:text-base font-medium text-center">
            Understanding your industry helps us provide features, resources,
            and updates that align with your professional needs.
          </p>
          <div className="max-w-[458px] mx-auto">
            <div className="flex mx-auto justify-center">
              <SProgress4 />
            </div>
            <div className="mt-6 lg:mt-[52px] ">
              {/* 1st input */}

              <div className="mt-[29px]">
                <p className="text-black text-[11px] lg:text-[14px] ">
                  Which of these options best describes your industry
                </p>
                <div className=" border-[1px] border-gray-200 hover:border-indigo-600 w-full px-[9px] py-[16px] rounded-[6px] mt-3">
                  <select
                    name="country"
                    value=""
                    onChange={handleChange}
                    id=""
                    className="w-full  bg-transparent rounded-md border-[1px] text-black text-base border-none  outline-none "
                  >
                    <option
                      disabled
                      selected
                      value=""
                      className="text-[14px] lg:text-base bg-transparent text-black"
                    >
                      Select Your Industry
                    </option>
                    {industryList.map((industry) => (
                      <option
                        value={industry}
                        className=" text-[14px] lg:text-base bg-transparent text-black"
                      >
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* nav buttons */}
              <div className="flex items-center justify-center gap-x-4 mx-auto mt-[52px] ">
                <button
                  onClick={handlePrev}
                  className="text-indigo-500 font-semibold text-base border-[1px] border-indigo-500  py-3 px-4 rounded-lg"
                >
                  Prev
                </button>{" "}
                <button
                  onClick={handleNext}
                  disabled={currentIndex === stages.length - 1}
                  className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-3 px-4 rounded-lg"
                >
                  Create Profile
                </button>{" "}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 5th */}
      {currentIndex === 4 && (
        <div className="px-3 lg:px-0 max-w-full lg:max-w-[603px] mt-6 lg:mt-10 mx-auto ">
          <div className="flex mx-auto justify-center">
            <SProgress5 />
          </div>
          <div className="mt-[24px] lg:mt-[52px] ">
            <div className="flex justify-center">
              <SpCheck />
            </div>
            <p className="text-black text-[20px] font-semibold text-center mt-6 ">
              Congratulations Emma{" "}
            </p>

            <p className="text-black font-medium text-center mt-3">
              Your profile has been created successfully, start exploring zikoro
              bookings!{" "}
            </p>

            {/* buttons */}
            <div className="flex justify-center gap-x-4 mx-auto mt-[52px] ">
              <button className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-3 px-4 rounded-lg">
                Start Exploring
              </button>{" "}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
