import { Schema, models, model, Document } from "mongoose";

export interface IPayments extends Document {
  id: string;
  object: string;
  after_expiration: string | null;
  allow_promotion_codes: string | null;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: {
    enabled: boolean;
    status: string;
  };
  billing_address_collection: string;
  cancel_url: string;
  client_reference_id: string;
  client_secret: string | null;
  consent: {
    promotions: string | null;
    terms_of_service: string;
  };
  consent_collection: {
    promotions: string;
    terms_of_service: string;
  };
  created: number;
  currency: string;
  currency_conversion: string | null;
  custom_fields: any[];
  custom_text: {
    shipping_address: string | null;
    submit: {
      message: string;
    };
    terms_of_service_acceptance: {
      message: string;
    };
  };
  customer: string;
  customer_creation: string;
  customer_details: {
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string | null;
      postal_code: string;
      state: string;
    };
    email: string;
    name: string;
    phone: string | null;
    tax_exempt: string;
    tax_ids: any[];
  };
  customer_email: string;
  expires_at: number;
  invoice: {
    id: string;
    object: string;
    hosted_invoice_url: string;
    invoice_pdf: string;
  };
  invoice_creation: {
    enabled: boolean;
  };
  line_items: {
    data: {
      id: string;
      object: string;
      description: string;
    }[];
  };
  livemode: boolean;
  locale: string | null;
  metadata: {
    mongouserID: string;
    rndm: string;
    user_name: string;
  };
  mode: string;
  payment_intent: string;
  payment_link: string | null;
  payment_method_collection: string;
  payment_method_configuration_details: string | null;
  payment_method_options: any;
  payment_method_types: string[];
  payment_status: string;
  phone_number_collection: {
    enabled: boolean;
  };
  status: string;
  submit_type: string;
  subscription: string | null;
  success_url: string;
  total_details: {
    amount_discount: number;
    amount_shipping: number;
    amount_tax: number;
  };
  ui_mode: string;
  url: string | null;
  createdAtDB: Date;
  session_start: Date;
  session_end: Date;
  session_vgpt: string;
}

const PaymentsSchema = new Schema<IPayments>({
  id: String,
  object: String,
  after_expiration: { type: String, default: null },
  allow_promotion_codes: { type: String, default: null },
  amount_subtotal: Number,
  amount_total: Number,
  automatic_tax: {
    enabled: Boolean,
    status: String,
  },
  billing_address_collection: String,
  cancel_url: String,
  client_reference_id: String,
  client_secret: { type: String, default: null },
  consent: {
    promotions: { type: String, default: null },
    terms_of_service: { type: String, required: false },
  },
  consent_collection: {
    promotions: { type: String, required: false },
    terms_of_service: { type: String, required: false },
  },
  created: Number,
  currency: String,
  currency_conversion: { type: String, default: null },
  custom_fields: [Schema.Types.Mixed],
  custom_text: {
    shipping_address: { type: String, default: null },
    submit: {
      message: { type: String, required: false },
    },
    terms_of_service_acceptance: {
      message: { type: String, required: false },
    },
  },
  customer: String,
  customer_creation: String,
  customer_details: {
    address: {
      city: String,
      country: String,
      line1: String,
      line2: { type: String, default: null },
      postal_code: String,
      state: String,
    },
    email: String,
    name: String,
    phone: { type: String, default: null },
    tax_exempt: String,
    tax_ids: [Schema.Types.Mixed],
  },
  customer_email: String,
  expires_at: Number,
  invoice: {
    id: String,
    object: String,
    hosted_invoice_url: String,
    invoice_pdf: String,
  },
  invoice_creation: {
    enabled: Boolean,
  },
  line_items: {
    data: [
      {
        id: String,
        object: String,
        description: String,
      },
    ],
  },
  livemode: Boolean,
  locale: { type: String, default: null },
  metadata: {
    mongouserID: String,
    rndm: String,
    user_name: String,
  },
  mode: String,
  payment_intent: String,
  payment_link: { type: String, default: null },
  payment_method_collection: String,
  payment_method_configuration_details: { type: String, default: null },
  payment_method_options: Schema.Types.Mixed,
  payment_method_types: [String],
  payment_status: String,
  phone_number_collection: {
    enabled: Boolean,
  },
  status: String,
  submit_type: String,
  subscription: { type: String, default: null },
  success_url: String,
  total_details: {
    amount_discount: Number,
    amount_shipping: Number,
    amount_tax: Number,
  },
  ui_mode: String,
  url: { type: String, default: null },
  createdAtDB: { type: Date, default: Date.now },
  session_start: { type: Date },
  session_end: { type: Date },
  session_vgpt: { type: String, default: "new" },
});

const Payments = models.Payments || model("Payments", PaymentsSchema);

export default Payments;
