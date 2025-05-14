
'use server';

import fs from 'fs/promises';
import path from 'path';
import * as z from 'zod';

// Schema for the data to be saved (matching PurchaseFormValues from client, plus some context)
// NOT EXPORTED
const UserDataSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  phone: z.string().regex(/^\d{10,15}$/, { message: "Phone number must be 10-15 digits." }), // Adjusted regex for common phone lengths
  email: z.string().email({ message: "Invalid email address." }),
  socialMedia: z.string().optional().or(z.literal('')),
  pinCode: z.string().regex(/^\d{6}$/, { message: "PIN code must be 6 digits." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  query: z.string().optional().or(z.literal('')),
  productName: z.string(),
  productId: z.string(),
  timestamp: z.string().datetime(),
});

// NOT EXPORTED
type UserData = z.infer<typeof UserDataSchema>;

interface SaveUserDataResult {
  success: boolean;
  message: string;
  error?: string;
  errors?: z.ZodIssue[];
}

// Path to userdata.json in the src/components directory
const userDataFilePath = path.join(process.cwd(), 'src', 'components', 'userdata.json');

export async function saveUserDataAction(data: UserData): Promise<SaveUserDataResult> {
  const validationResult = UserDataSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Invalid data provided for saving.',
      errors: validationResult.error.errors,
    };
  }

  try {
    // Ensure the directory exists (though /src/components/ should already exist)
    // No need to read existing data if we are overwriting
    await fs.mkdir(path.dirname(userDataFilePath), { recursive: true });

    // Overwrite the file with the new data object
    await fs.writeFile(userDataFilePath, JSON.stringify(validationResult.data, null, 2), 'utf-8');

    return {
      success: true,
      message: 'User data saved successfully to userdata.json (overwritten).',
    };
  } catch (error: any) {
    console.error('Error saving user data to file:', error.message);
    return {
      success: false,
      message: 'Failed to save user data to file.',
      error: error.message,
    };
  }
}
