
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
export type UserData = z.infer<typeof UserDataSchema>;

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
    let existingData: UserData[] = [];
    try {
      const fileContent = await fs.readFile(userDataFilePath, 'utf-8');
      const parsedContent = JSON.parse(fileContent);
      if (Array.isArray(parsedContent)) {
        existingData = parsedContent;
      } else {
        console.warn('userdata.json does not contain a valid array. Initializing with new data. Old data might be lost.');
        existingData = []; // Initialize to prevent further errors
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, which is fine. We'll create it.
        console.log('userdata.json not found, will be created.');
      } else if (error instanceof SyntaxError) {
         // File exists but is not valid JSON
        console.warn('userdata.json contains invalid JSON. Initializing with new data. Old data might be lost.');
        existingData = []; // Initialize to prevent further errors
      }
       else {
        // Other read errors
        console.error('Error reading userdata.json:', error.message);
        return {
          success: false,
          message: 'Failed to read existing user data file.',
          error: error.message,
        };
      }
    }

    existingData.push(validationResult.data);

    await fs.writeFile(userDataFilePath, JSON.stringify(existingData, null, 2), 'utf-8');

    return {
      success: true,
      message: 'User data saved successfully to userdata.json.',
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
