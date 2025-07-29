// Advanced Form with React Hook Form and Zod validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  age: z
    .number()
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Age seems unrealistic'),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be under 500 characters'),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  experience: z.enum(['junior', 'mid', 'senior', 'lead'], {
    errorMap: () => ({ message: 'Please select your experience level' }),
  }),
  agreeToTerms: z.boolean().refine((val) => val, 'You must agree to the terms'),
  newsletter: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface SubmissionResult {
  id: string;
  timestamp: string;
  data: FormData;
}

const skillOptions = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'C#',
  'PHP',
  'Go',
  'Rust',
];

const AdvancedForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      skills: [],
      newsletter: false,
      agreeToTerms: false,
    },
  });

  const watchedSkills = watch('skills') || [];
  const watchedBio = watch('bio') || '';

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result: SubmissionResult = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        data,
      };

      setSubmissionResult(result);
      toast.success('Form submitted successfully! 🎉');
      reset();
    } catch (error) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = watchedSkills;
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill];
    setValue('skills', updatedSkills, { shouldValidate: true });
  };

  return (
    <div className='mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800'>
      <Toaster position='top-right' />

      <div className='bg-gradient-to-r from-indigo-500 to-purple-600 p-6'>
        <h3 className='mb-2 text-2xl font-bold text-white'>
          Advanced Form Validation
        </h3>
        <p className='text-indigo-100'>React Hook Form + Zod + TypeScript</p>
      </div>

      <div className='p-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Personal Information */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                First Name
              </label>
              <input
                {...register('firstName')}
                className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'}`}
                placeholder='John'
              />
              {errors.firstName && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Last Name
              </label>`
              <input
                {...register('lastName')}
                className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'}`}
                placeholder='Doe'
              />
              {errors.lastName && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email and Age */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='md:col-span-2'>
              <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Email
              </label>
              <input
                {...register('email')}
                type='email'
                className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'}`}
                placeholder='john.doe@example.com'
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Age
              </label>
              <input
                {...register('age', { valueAsNumber: true })}
                type='number'
                className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${errors.age ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'}`}
                placeholder='25'
              />
              {errors.age && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.age.message}
                </p>
              )}
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Website (Optional)
            </label>
            <input
              {...register('website')}
              type='url'
              className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${errors.website ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'}`}
              placeholder='https://your-website.com'
            />
            {errors.website && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.website.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Bio
            </label>
            <textarea
              {...register('bio')}
              rows={4}
              className={`w-full resize-none rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${errors.bio ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'}`}
              placeholder='Tell us about yourself...'
            />
            <div className='mt-1 flex items-center justify-between'>
              {errors.bio ? (
                <p className='text-sm text-red-600'>{errors.bio.message}</p>
              ) : (
                <p className='text-sm text-gray-500'>Minimum 10 characters</p>
              )}
              <p className='text-sm text-gray-500'>{watchedBio.length}/500</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Skills
            </label>
            <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type='button'
                  onClick={() => handleSkillToggle(skill)}
                  className={`rounded-lg p-2 text-sm font-medium transition-colors ${watchedSkills.includes(skill) ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {errors.skills && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.skills.message}
              </p>
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Experience Level
            </label>
            <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
              {['junior', 'mid', 'senior', 'lead'].map((level) => (
                <label key={level} className='flex items-center'>
                  <input
                    {...register('experience')}
                    type='radio'
                    value={level}
                    className='mr-2 text-indigo-600 focus:ring-indigo-500'
                  />
                  <span className='text-sm capitalize text-gray-700 dark:text-gray-300'>
                    {level}
                  </span>
                </label>
              ))}
            </div>
            {errors.experience && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Checkboxes */}
          <div className='space-y-3'>
            <label className='flex items-start'>
              <input
                {...register('agreeToTerms')}
                type='checkbox'
                className='mr-2 mt-1 text-indigo-600 focus:ring-indigo-500'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                I agree to the terms and conditions and privacy policy
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className='ml-6 text-sm text-red-600'>
                {errors.agreeToTerms.message}
              </p>
            )}

            <label className='flex items-start'>
              <input
                {...register('newsletter')}
                type='checkbox'
                className='mr-2 mt-1 text-indigo-600 focus:ring-indigo-500'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                Subscribe to our newsletter for updates
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className='flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600'>
            <div className='text-sm text-gray-500'>
              {isDirty ? (
                isValid ? (
                  <span className='text-green-600'>✓ Form is valid</span>
                ) : (
                  <span className='text-red-600'>✗ Please fix errors</span>
                )
              ) : (
                <span>Fill out the form above</span>
              )}
            </div>

            <button
              type='submit'
              disabled={!isValid || isSubmitting}
              className='transform rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-indigo-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>

        {/* Submission Result */}
        {submissionResult && (
          <div className='mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'>
            <h4 className='mb-2 font-semibold text-green-800 dark:text-green-300'>
              Submission Successful!
            </h4>
            <pre className='overflow-x-auto text-sm text-green-700 dark:text-green-400'>
              {JSON.stringify(submissionResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdvancedForm;