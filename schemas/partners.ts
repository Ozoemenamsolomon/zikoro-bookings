import * as z from "zod";

const bannerSchema = z.array(
  z.object({
    file: z.any(),
    link: z
      .string()
      .min(3, { message: "Banner Link is required" })
      .refine((value) => value && /^[https://]/.test(value), {
        message: "Banner Link is Invalid",
      }),
  })
);
export const addBannerSchema = z.object({
  banners: bannerSchema,
});

export const jobSchema = z.object({
  jobTitle: z.string().min(3, { message: "Title is required" }),
  maxSalary: z.string().min(3, { message: "Max. Salary is required" }),
  minSalary: z.string().min(3, { message: "Min. Salary is required" }),
  salaryDuration: z.string().min(3, { message: "Salary Duration is required" }),
  flexibility: z.string().min(3, { message: "Flexibility Type is required" }),
  description: z.string().min(3, { message: "Job Description is required" }),
  city: z.string().min(3, { message: "City is required" }),
  applicationMode: z.enum(["whatsapp", "email", "url"]),
  country: z.string().min(3, { message: "Country is required" }),
  employmentType: z.string().min(3, { message: "Employment Type is required" }),
  experienceLevel: z
    .string()
    .min(3, { message: "Experience Level is required" }),
  qualification: z.string().min(3, { message: "Qualification is required" }),
  applicationLink: z
    .string()
    .refine((value) => value !== undefined && value.trim() !== "", {
      message: "Please provide a url",
    })
    .optional(),
  whatsApp: z
    .string()
    .refine((value) => value !== undefined && value.trim() !== "", {
      message: "Please provide a url",
    })
    .optional(),
  email: z
    .string()
    .email({ message: "Email must be a valid email" })
    .refine(
      (value) =>
        value && /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(value),
      {
        message: "Invalid email address",
      }
    )
    .optional(),
});

export const partnerSchema = z.object({
  eventId: z.string(),
  eventAlias: z.string(),
  companyLogo: z.any(),
  media: z.any(),
  eventName: z.string().min(1, { message: "Event Name is required" }),
  partnerType: z.string().min(3, { message: "Title is required" }),
  companyName: z.string().min(3, { message: "Company Name is required" }),
  description: z.string().min(3, { message: "Job Description is required" }),
  city: z.string().min(3, { message: "City is required" }),
  country: z.string().min(3, { message: "Country is required" }),
  email: z
    .string()
    .email({ message: "Email must be a valid email" })
    .refine(
      (value) =>
        value && /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(value),
      {
        message: "Invalid email address",
      }
    ),
  industry: z.string().min(3, { message: "Industry is required" }),
  boothStaff: z.string().min(3, { message: "Staff is required" }),
  website: z.string().min(3, { message: "Website Link is required" }),
  phoneNumber: z
    .string()
    .refine((value) => value && /^\d{11,}$/.test(value.replace(/\D/g, "")), {
      message: "Phone number must be at least 11 digits long",
    })
    .refine((value) => value && /^\+\d{1,3}/.test(value), {
      message: "Phone number must include start with a country code",
    }),
  whatsApp: z
    .string()
    .refine((value) => value && /^\d{11,}$/.test(value.replace(/\D/g, "")), {
      message: "Phone number must be at least 11 digits long",
    })
    .refine((value) => value && /^\+\d{1,3}/.test(value), {
      message: "Phone number must include start with a country code",
    })
    .optional(),
});

export const hallSchema = z.object({
  name: z.string().min(3, { message: "Hall Name is required" }),
  capacity: z.string().min(1, { message: "Hall Capacity is required" }),
});

export const offerCreationSchema = z.object({
  serviceTitle: z.string().min(3, { message: "Title is required" }),
  productImage: z.any(),
  endDate: z.string().min(3, { message: "Application Link is required" }),
  productPrice: z.string().min(3, { message: "Max. Salary is required" }),
  productPromo: z.string().min(3, { message: "Min. Salary is required" }),
  offerDetails: z.string().min(3, { message: "Offer Details is required" }),
  voucherCode: z.any(),
  redeem: z.enum(["whatsapp", "email", "url"]),
  url: z
    .string()
    .refine((value) => value !== undefined && value.trim() !== "", {
      message: "Please provide a url",
    })
    .optional(),
  whatsApp: z
    .string()
    .refine((value) => value !== undefined && value.trim() !== "", {
      message: "Please provide a url",
    })
    .optional(),
  email: z
    .string()
    .email({ message: "Email must be a valid email" })
    .refine(
      (value) =>
        value && /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(value),
      {
        message: "Invalid email address",
      }
    )
    .optional(),
});

export const partnerDeactivateSchema = z.object({
  reason: z.string()
})