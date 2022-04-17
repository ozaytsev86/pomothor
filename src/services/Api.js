import { createClient } from "@supabase/supabase-js";
import {REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY} from '../configs/Supabase';

export const supabase = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY);