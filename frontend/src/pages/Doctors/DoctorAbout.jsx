



import React from "react";
import { formateDate } from "../../utils/formateDate";

const DoctorAbout = ({ doctor }) => {
  const { name, education, experience } = doctor;

  return (
    <div>
      <div>
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
          About
          <span className="text-irisBlueColor font-bold text-[24px] leading-5">
            {name}
          </span>
        </h3>
        <p className="text_para">
          {doctor.bio || "No description available"}
        </p>
      </div>

      <div className="mt-12">
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
          Education
        </h3>

        <ul className="pt-4 md:p-5">
          {education && education.map((edu, index) => (
            <li key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
              <div>
                {/* <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">
                  {formateDate(edu.startDate)} - {formateDate(edu.endDate)}
                </span> */}
                <p className="text-[16px] leading-6 font-medium text-textColor">
                   {edu} {/* {edu.degree} */}
                </p>
              </div>
              {/* <p className="text-[16px] leading-6 font-medium text-textColor">
                {edu.institution}
              </p> */}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
          Experience
        </h3>

        <ul className="grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5">
          {experience && experience.map((exp, index) => (
            <li key={index} className="p-4 rounded bg-[#FFF9EA]">
              {/* <span className="text-yellowColor text-[15px] leading-6 font-semibold">
                {formateDate(exp.startDate)} - {formateDate(exp.endDate)}
              </span> */}
              <p className="text-[16px] leading-6 font-medium text-textColor">
                  {exp}   {/* {exp.title} */}
              </p>
              {/* <p className="text-[15px] leading-5 font-medium text-textColor">
                {exp.institution}
              </p> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorAbout;
