import * as yup from 'yup'

export const eventSchema = yup.object().shape({
  clientName: yup.string().required('Client Name is required'),
  eventName: yup.string().required('Event Name is required'),
  eventType: yup.string().required('Event Type is required'),
  eventDate: yup.date().nullable().required('Event Date is required'),
  eventTime: yup.date().nullable(),
  venueName: yup.string().required('Venue Name is required'),
  venueAddress: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  pincode: yup.string().nullable(),
  
  // Photography Details
  photographerId: yup.string().nullable(),
  videographerId: yup.string().nullable(),
  droneRequired: yup.boolean().default(false),
  liveStreaming: yup.boolean().default(false),
  albumRequired: yup.boolean().default(false),
  candidPhotography: yup.boolean().default(false),
  traditionalPhotography: yup.boolean().default(false),
  traditionalVideo: yup.boolean().default(false),

  // Package Details
  packageId: yup.string().nullable(),
  packagePrice: yup
    .number()
    .typeError('Package Price must be a number')
    .required('Package Price is required')
    .min(0, 'Price must be positive'),
  advancePaid: yup
    .number()
    .typeError('Advance Paid must be a number')
    .required('Advance Paid is required')
    .min(0, 'Advance cannot be negative')
    .test('max-advance', 'Advance Paid cannot exceed Package Price', function (value) {
      const { packagePrice } = this.parent
      if (value !== undefined && packagePrice !== undefined) {
        return value <= packagePrice
      }
      return true
    }),

  // Event Status
  eventStatus: yup.string().default('Booked'),

  // Notes
  specialInstructions: yup.string().nullable()
})
