// Complete Gran Turismo 7 car list with drivetrain data
// Drivetrain types: FR (Front Engine, Rear-Wheel Drive), FF (Front Engine, Front-Wheel Drive),
// MR (Mid Engine, Rear-Wheel Drive), RR (Rear Engine, Rear-Wheel Drive), 4WD (All-Wheel Drive)

export const CARS = [
  // Aston Martin
  { name: 'Aston Martin DB11', value: 'aston_martin_db11', drivetrain: 'FR' },
  { name: 'Aston Martin DBR9 10', value: 'aston_martin_dbr9_10', drivetrain: 'FR' },
  { name: 'Aston Martin DBR9 09', value: 'aston_martin_dbr9_09', drivetrain: 'FR' },
  { name: 'Aston Martin One-77', value: 'aston_martin_one_77', drivetrain: 'FR' },
  { name: 'Aston Martin V12 Vantage', value: 'aston_martin_v12_vantage', drivetrain: 'FR' },
  { name: 'Aston Martin V12 Zagato', value: 'aston_martin_v12_zagato', drivetrain: 'FR' },
  { name: 'Aston Martin Vulcan', value: 'aston_martin_vulcan', drivetrain: 'FR' },
  
  // Alfa Romeo
  { name: 'Alfa Romeo 155 Q4', value: 'alfa_romeo_155_q4', drivetrain: '4WD' },
  { name: 'Alfa Romeo 4C', value: 'alfa_romeo_4c', drivetrain: 'FR' },
  { name: 'Alfa Romeo Giulia GTA', value: 'alfa_romeo_giulia_gta', drivetrain: 'FR' },
  { name: 'Alfa Romeo SZ', value: 'alfa_romeo_sz', drivetrain: 'FR' },
  
  // Audi
  { name: 'Audi A1 quattro', value: 'audi_a1_quattro', drivetrain: '4WD' },
  { name: 'Audi E-tron Vision GT', value: 'audi_e_tron_vision_gt', drivetrain: '4WD' },
  { name: 'Audi R8 LMS', value: 'audi_r8_lms', drivetrain: 'MR' },
  { name: 'Audi R8 R tronic', value: 'audi_r8_r_tronic', drivetrain: 'MR' },
  { name: 'Audi R18 TDI', value: 'audi_r18_tdi', drivetrain: 'MR' },
  { name: 'Audi RS 6 Avant', value: 'audi_rs6_avant', drivetrain: '4WD' },
  { name: 'Audi TT Cup', value: 'audi_tt_cup', drivetrain: '4WD' },
  { name: 'Audi Vision Gran Turismo', value: 'audi_vision_gran_turismo', drivetrain: '4WD' },
  
  // BMW
  { name: 'BMW 2002 Turbo', value: 'bmw_2002_turbo', drivetrain: 'FR' },
  { name: 'BMW 3.0 CSL', value: 'bmw_3_0_csl', drivetrain: 'FR' },
  { name: 'BMW M3', value: 'bmw_m3', drivetrain: 'FR' },
  { name: 'BMW M3 Coupe 08', value: 'bmw_m3_coupe_08', drivetrain: 'FR' },
  { name: 'BMW M3 Evolution IV', value: 'bmw_m3_evolution_iv', drivetrain: 'FR' },
  { name: 'BMW M4 Coupe', value: 'bmw_m4_coupe', drivetrain: 'FR' },
  { name: 'BMW M235i Racing', value: 'bmw_m235i_racing', drivetrain: 'FR' },
  { name: 'BMW M6 GTLM', value: 'bmw_m6_gtlm', drivetrain: 'FR' },
  { name: 'BMW M50 Turbo', value: 'bmw_m50_turbo', drivetrain: 'FR' },
  { name: 'BMW M1 Procar', value: 'bmw_m1_procar', drivetrain: 'MR' },
  { name: 'BMW LMR GTR', value: 'bmw_lmr_gtr', drivetrain: 'FR' },
  { name: 'BMW Z4 GT3', value: 'bmw_z4_gt3', drivetrain: 'FR' },
  
  // Bugatti
  { name: 'Bugatti EB110 SS', value: 'bugatti_eb110_ss', drivetrain: '4WD' },
  { name: 'Bugatti Veyron 16.4', value: 'bugatti_veyron_16_4', drivetrain: '4WD' },
  { name: 'Bugatti Vision Gran Turismo', value: 'bugatti_vision_gran_turismo', drivetrain: '4WD' },
  
  // Chevrolet
  { name: 'Chevrolet Camaro SS 2010', value: 'chevrolet_camaro_ss_2010', drivetrain: 'FR' },
  { name: 'Chevrolet Camaro Z/28', value: 'chevrolet_camaro_z_28', drivetrain: 'FR' },
  { name: 'Chevrolet Corvette', value: 'chevrolet_corvette', drivetrain: 'FR' },
  { name: 'Chevrolet Corvette C6.R GT2', value: 'chevrolet_corvette_c6_r_gt2', drivetrain: 'FR' },
  { name: 'Chevrolet Corvette C8 Stingray', value: 'chevrolet_corvette_c8_stingray', drivetrain: 'MR' },
  { name: 'Chevrolet Corvette Stingray', value: 'chevrolet_corvette_stingray', drivetrain: 'FR' },
  { name: 'Chevrolet ZL1 LS9', value: 'chevrolet_zl1_ls9', drivetrain: 'FR' },
  
  // Dodge
  { name: 'Dodge Challenger SRT8', value: 'dodge_challenger_srt8', drivetrain: 'FR' },
  { name: 'Dodge Challenger R/T', value: 'dodge_challenger_rt', drivetrain: 'FR' },
  { name: 'Dodge Charger R/T', value: 'dodge_charger_rt', drivetrain: 'FR' },
  { name: 'Dodge Viper GTS', value: 'dodge_viper_gts', drivetrain: 'FR' },
  
  // Ferrari
  { name: 'Ferrari 250 GTO', value: 'ferrari_250_gto', drivetrain: 'FR' },
  { name: 'Ferrari 458 Italia', value: 'ferrari_458_italia', drivetrain: 'MR' },
  { name: 'Ferrari 458 Italia GT2', value: 'ferrari_458_italia_gt2', drivetrain: 'MR' },
  { name: 'Ferrari 488 Pista', value: 'ferrari_488_pista', drivetrain: 'MR' },
  { name: 'Ferrari 488 Pista Piloti', value: 'ferrari_488_pista_piloti', drivetrain: 'MR' },
  { name: 'Ferrari 488 Spider', value: 'ferrari_488_spider', drivetrain: 'MR' },
  { name: 'Ferrari 488 GT Berlinetta', value: 'ferrari_488_gt_berlinetta', drivetrain: 'MR' },
  { name: 'Ferrari 499P', value: 'ferrari_499p', drivetrain: 'MR' },
  { name: 'Ferrari 812 Superfast', value: 'ferrari_812_superfast', drivetrain: 'FR' },
  { name: 'Ferrari F8 Tributo', value: 'ferrari_f8_tributo', drivetrain: 'MR' },
  { name: 'Ferrari FXX', value: 'ferrari_fxx', drivetrain: 'MR' },
  { name: 'Ferrari FXX K', value: 'ferrari_fxx_k', drivetrain: 'MR' },
  { name: 'Ferrari F1 BPM', value: 'ferrari_f1_bpm', drivetrain: 'FR' },
  { name: 'Ferrari Monza SP1', value: 'ferrari_monza_sp1', drivetrain: 'MR' },
  { name: 'Ferrari Monza SP2', value: 'ferrari_monza_sp2', drivetrain: 'MR' },
  { name: 'Ferrari Enzo Ferrari', value: 'ferrari_enzo_ferrari', drivetrain: 'MR' },
  { name: 'Ferrari Testarossa', value: 'ferrari_testarossa', drivetrain: 'FR' },
  { name: 'Ferrari SF90 Stradale', value: 'ferrari_sf90_stradale', drivetrain: 'MR' },
  
  // Ford
  { name: 'Ford Focus RS', value: 'ford_focus_rs', drivetrain: '4WD' },
  { name: 'Ford Mustang Boss S', value: 'ford_mustang_boss_s', drivetrain: 'FR' },
  { name: 'Ford Mustang Mach 1', value: 'ford_mustang_mach_1', drivetrain: 'FR' },
  { name: 'Ford GT', value: 'ford_gt', drivetrain: 'MR' },
  { name: 'Ford GT GT40', value: 'ford_gt_gt40', drivetrain: 'FR' },
  { name: 'Ford GT LM', value: 'ford_gt_lm', drivetrain: 'FR' },
  { name: 'Ford Mark IV', value: 'ford_mark_iv', drivetrain: 'FR' },
  { name: 'Ford Transit Supervan 3', value: 'ford_transit_supervan_3', drivetrain: 'FF' },
  
  // Ginetta
  { name: 'Ginetta G55 GT4', value: 'ginetta_g55_gt4', drivetrain: 'FR' },
  
  // Glickenhaus
  { name: 'Glickenhaus SCG003S', value: 'glickenhaus_scg003s', drivetrain: 'MR' },
  { name: 'Glickenhaus SCG004C', value: 'glickenhaus_scg004c', drivetrain: 'MR' },
  { name: 'Glickenhaus SCG005C', value: 'glickenhaus_scg005c', drivetrain: 'MR' },
  { name: 'Glickenhaus SCG006 C', value: 'glickenhaus_scg006_c', drivetrain: 'MR' },
  { name: 'Glickenhaus SCG007', value: 'glickenhaus_scg007', drivetrain: 'MR' },
  { name: 'Glickenhaus SCG08', value: 'glickenhaus_scg08', drivetrain: 'MR' },
  
  // Gordon Murray
  { name: 'Gordon Murray T.50', value: 'gordon_murray_t_50', drivetrain: 'MR' },
  
  // Hennessey
  { name: 'Hennessey Venom GT', value: 'hennessey_venom_gt', drivetrain: 'FR' },
  
  // Holden
  { name: 'Holden Monaro GTO', value: 'holden_monaro_gto', drivetrain: 'FR' },
  
  // Honda
  { name: 'Honda Civic Type R', value: 'honda_civic_type_r', drivetrain: 'FF' },
  { name: 'Honda City Turbo', value: 'honda_city_turbo', drivetrain: 'FF' },
  { name: 'Honda CR-Z', value: 'honda_cr_z', drivetrain: 'FF' },
  { name: 'Honda e', value: 'honda_e', drivetrain: 'FF' },
  { name: 'Honda FCX Concept', value: 'honda_fcx_concept', drivetrain: 'FF' },
  { name: 'Honda Fit', value: 'honda_fit', drivetrain: 'FF' },
  { name: 'Honda Fit Hybrid', value: 'honda_fit_hybrid', drivetrain: 'FF' },
  { name: 'Honda HSV-010', value: 'honda_hsv_010', drivetrain: 'FR' },
  { name: 'Honda HSV-010 GT', value: 'honda_hsv_010_gt', drivetrain: 'FR' },
  { name: 'Honda Integra Type R', value: 'honda_integra_type_r', drivetrain: 'FF' },
  { name: 'Honda NSX', value: 'honda_nsx', drivetrain: 'MR' },
  { name: 'Honda NSX GT3', value: 'honda_nsx_gt3', drivetrain: 'MR' },
  { name: 'Honda NSX GT500', value: 'honda_nsx_gt500', drivetrain: 'MR' },
  { name: 'Honda NSX Type-R', value: 'honda_nsx_type_r', drivetrain: 'MR' },
  { name: 'Honda RC213V-S', value: 'honda_rc213v_s', drivetrain: 'MR' },
  { name: 'Honda S2000', value: 'honda_s2000', drivetrain: 'FR' },
  { name: 'Honda S660', value: 'honda_s660', drivetrain: 'MR' },
  
  // Jaguar
  { name: 'Jaguar E-type', value: 'jaguar_e_type', drivetrain: 'FR' },
  { name: 'Jaguar XJ220', value: 'jaguar_xj220', drivetrain: 'FR' },
  { name: 'Jaguar Vision Gran Turismo', value: 'jaguar_vision_gran_turismo', drivetrain: 'MR' },
  { name: 'Jaguar Vision GT Coupé', value: 'jaguar_vision_gt_coupe', drivetrain: 'MR' },
  { name: 'Jaguar Vision GT SV', value: 'jaguar_vision_gt_sv', drivetrain: 'MR' },
  
  // Jeep
  { name: 'Jeep Wrangler', value: 'jeep_wrangler', drivetrain: '4WD' },
  
  // KTM
  { name: 'KTM X-Bow', value: 'ktm_x_bow', drivetrain: 'FR' },
  { name: 'KTM X-Bow GT2', value: 'ktm_x_bow_gt2', drivetrain: 'FR' },
  
  // Lamborghini
  { name: 'Lamborghini Aventador LP 700-4', value: 'lamborghini_aventador_lp_700_4', drivetrain: '4WD' },
  { name: 'Lamborghini Aventador S', value: 'lamborghini_aventador_s', drivetrain: '4WD' },
  { name: 'Lamborghini Aventador SV', value: 'lamborghini_aventador_sv', drivetrain: '4WD' },
  { name: 'Lamborghini Countach LP400', value: 'lamborghini_countach_lp400', drivetrain: 'FR' },
  { name: 'Lamborghini Diablo 6.0 GTR', value: 'lamborghini_diablo_6_0_gtr', drivetrain: 'FR' },
  { name: 'Lamborghini Essenza SCV12', value: 'lamborghini_essenza_scv12', drivetrain: 'FR' },
  { name: 'Lamborghini Huracan LP 610-4', value: 'lamborghini_huracan_lp_610_4', drivetrain: '4WD' },
  { name: 'Lamborghini Huracan GT3', value: 'lamborghini_huracan_gt3', drivetrain: 'FR' },
  { name: 'Lamborghini Huracan LP 770-4', value: 'lamborghini_huracan_lp_770_4', drivetrain: '4WD' },
  { name: 'Lamborghini Huracan STO', value: 'lamborghini_huracan_sto', drivetrain: 'FR' },
  { name: 'Lamborghini Huracan Tecnica', value: 'lamborghini_huracan_tecnica', drivetrain: 'FR' },
  { name: 'Lamborghini Murciélago', value: 'lamborghini_murciclago', drivetrain: 'FR' },
  { name: 'Lamborghini Murciélago R-SV', value: 'lamborghini_murciclago_r_sv', drivetrain: 'FR' },
  { name: 'Lamborghini Miura', value: 'lamborghini_miura', drivetrain: 'FR' },
  { name: 'Lamborghini Reventon', value: 'lamborghini_reventon', drivetrain: 'FR' },
  { name: 'Lamborghini Terzo Millennio', value: 'lamborghini_terzo_millennio', drivetrain: 'MR' },
  
  // Lancia
  { name: 'Lancia Delta HF Integrale', value: 'lancia_delta_hf_integrale', drivetrain: '4WD' },
  { name: 'Lancia LC2', value: 'lancia_lc2', drivetrain: 'MR' },
  { name: 'Lancia Stratos HF', value: 'lancia_stratos_hf', drivetrain: 'FR' },
  { name: 'Lancia Stratos HF Gr.5', value: 'lancia_stratos_hf_gr5', drivetrain: 'FR' },
  
  // Lotus
  { name: 'Lotus 2-11', value: 'lotus_2_11', drivetrain: 'FR' },
  { name: 'Lotus 3-Eleven GT4', value: 'lotus_3_eleven_gt4', drivetrain: 'FR' },
  { name: 'Lotus 90 SV', value: 'lotus_90_sv', drivetrain: 'FR' },
  { name: 'Lotus Elise', value: 'lotus_elise', drivetrain: 'FR' },
  { name: 'Lotus Emira', value: 'lotus_emira', drivetrain: 'FR' },
  { name: 'Lotus Evija', value: 'lotus_evija', drivetrain: 'MR' },
  { name: 'Lotus Exige', value: 'lotus_exige', drivetrain: 'FR' },
  { name: 'Lotus Exige S', value: 'lotus_exige_s', drivetrain: 'FR' },
  { name: 'Lotus GT1 98', value: 'lotus_gt1_98', drivetrain: 'FR' },
  { name: 'Lotus Speedster', value: 'lotus_speedster', drivetrain: 'FR' },
  
  // Maserati
  { name: 'Maserati 250F', value: 'maserati_250f', drivetrain: 'FR' },
  { name: 'Maserati GranTurismo S', value: 'maserati_granturismo_s', drivetrain: 'FR' },
  { name: 'Maserati GranTurismo MC12', value: 'maserati_granturismo_mc12', drivetrain: 'MR' },
  { name: 'Maserati Levante S', value: 'maserati_levante_s', drivetrain: 'FR' },
  { name: 'Maserati MC12', value: 'maserati_mc12', drivetrain: 'MR' },
  { name: 'Maserati MC12 Corsa', value: 'maserati_mc12_corsa', drivetrain: 'MR' },
  { name: 'Maserati MC20', value: 'maserati_mc20', drivetrain: 'MR' },
  
  // Mazda
  { name: 'Mazda 787B', value: 'mazda_787b', drivetrain: 'FR' },
  { name: 'Mazda Atenza', value: 'mazda_atenza', drivetrain: 'FF' },
  { name: 'Mazda Atenza G30', value: 'mazda_atenza_g30', drivetrain: 'FF' },
  { name: 'Mazda Demio', value: 'mazda_demio', drivetrain: 'FF' },
  { name: 'Mazda Furai Concept', value: 'mazda_furai_concept', drivetrain: 'MR' },
  { name: 'Mazda MX-30 EV Model', value: 'mazda_mx_30_ev_model', drivetrain: 'FF' },
  { name: 'Mazda MX-5', value: 'mazda_mx_5', drivetrain: 'FR' },
  { name: 'Mazda MX-5 1.8 RS NDERC', value: 'mazda_mx_5_1_8_rs_nderc', drivetrain: 'FR' },
  { name: 'Mazda MX-5 NB Sports', value: 'mazda_mx_5_nb_sports', drivetrain: 'FR' },
  { name: 'Mazda MX-5 Sport GrN', value: 'mazda_mx_5_sport_grn', drivetrain: 'FR' },
  { name: 'Mazda RX500', value: 'mazda_rx500', drivetrain: 'FR' },
  { name: 'Mazda RX-7', value: 'mazda_rx_7', drivetrain: 'FR' },
  { name: 'Mazda RX-7 Spirit R FD3S', value: 'mazda_rx_7_spirit_r_fd3s', drivetrain: 'FR' },
  { name: 'Mazda Vision Gran Turismo', value: 'mazda_vision_gran_turismo', drivetrain: 'FR' },
  
  // McLaren
  { name: 'McLaren 570GT', value: 'mclaren_570gt', drivetrain: 'MR' },
  { name: 'McLaren 570S', value: 'mclaren_570s', drivetrain: 'MR' },
  { name: 'McLaren 650S Coupe', value: 'mclaren_650s_coupe', drivetrain: 'MR' },
  { name: 'McLaren 12C', value: 'mclaren_12c', drivetrain: 'MR' },
  { name: 'McLaren 12C GT3', value: 'mclaren_12c_gt3', drivetrain: 'MR' },
  { name: 'McLaren 720S Coupe', value: 'mclaren_720s_coupe', drivetrain: 'MR' },
  { name: 'McLaren 765LT', value: 'mclaren_765lt', drivetrain: 'MR' },
  { name: 'McLaren Artura', value: 'mclaren_artura', drivetrain: 'MR' },
  { name: 'McLaren Elva', value: 'mclaren_elva', drivetrain: 'MR' },
  { name: 'McLaren F1', value: 'mclaren_f1', drivetrain: 'FR' },
  { name: 'McLaren F1 GTR', value: 'mclaren_f1_gtr', drivetrain: 'FR' },
  { name: 'McLaren GT', value: 'mclaren_gt', drivetrain: 'MR' },
  { name: 'McLaren M8D', value: 'mclaren_m8d', drivetrain: 'FR' },
  { name: 'McLaren Senna', value: 'mclaren_senna', drivetrain: 'MR' },
  
  // Mercedes
  { name: 'Mercedes 300 SL', value: 'mercedes_300_sl', drivetrain: 'FR' },
  { name: 'Mercedes 300 SLR', value: 'mercedes_300_slr', drivetrain: 'FR' },
  { name: 'Mercedes A45 S 4MATIC', value: 'mercedes_a45_s_4matic', drivetrain: '4WD' },
  { name: 'Mercedes AMG GT', value: 'mercedes_amg_gt', drivetrain: 'FR' },
  { name: 'Mercedes AMG GT3', value: 'mercedes_amg_gt3', drivetrain: 'FR' },
  { name: 'Mercedes AMG GT3 2015', value: 'mercedes_amg_gt3_2015', drivetrain: 'FR' },
  { name: 'Mercedes AMG GT Black', value: 'mercedes_amg_gt_black', drivetrain: 'FR' },
  { name: 'Mercedes AMG GT S', value: 'mercedes_amg_gt_s', drivetrain: 'FR' },
  { name: 'Mercedes AMG GT63 Coupe', value: 'mercedes_amg_gt63_coupe', drivetrain: 'FR' },
  { name: 'Mercedes C 63 AMG', value: 'mercedes_c_63_amg', drivetrain: 'FR' },
  { name: 'Mercedes CLK LM', value: 'mercedes_clk_lm', drivetrain: 'FR' },
  { name: 'Mercedes E 550', value: 'mercedes_e_550', drivetrain: 'FR' },
  { name: 'Mercedes F1 W05 Hybrid', value: 'mercedes_f1_w05_hybrid', drivetrain: 'FR' },
  { name: 'Mercedes GLA45 AMG', value: 'mercedes_gla45_amg', drivetrain: '4WD' },
  { name: 'Mercedes SLS AMG', value: 'mercedes_sls_amg', drivetrain: 'FR' },
  { name: 'Mercedes SLS AMG GT', value: 'mercedes_sls_amg_gt', drivetrain: 'FR' },
  { name: 'Mercedes Vision GT', value: 'mercedes_vision_gt', drivetrain: '4WD' },
  { name: 'Mercedes W08 EQ', value: 'mercedes_w08_eq', drivetrain: 'FR' },
  
  // Mini
  { name: 'Mini Cooper S', value: 'mini_cooper_s', drivetrain: 'FF' },
  { name: 'Mini Cooper S GrN', value: 'mini_cooper_s_grn', drivetrain: 'FF' },
  
  // Mitsubishi
  { name: 'Mitsubishi 3000GT', value: 'mitsubishi_3000gt', drivetrain: '4WD' },
  { name: 'Mitsubishi Concept-cX Gr.3', value: 'mitsubishi_concept_cx_gr3', drivetrain: 'FF' },
  { name: 'Mitsubishi Evolution VI', value: 'mitsubishi_evolution_vi', drivetrain: '4WD' },
  { name: 'Mitsubishi Evolution X', value: 'mitsubishi_evolution_x', drivetrain: '4WD' },
  { name: 'Mitsubishi Evolution X GSR', value: 'mitsubishi_evolution_x_gsr', drivetrain: '4WD' },
  { name: 'Mitsubishi i MiEV Evo', value: 'mitsubishi_i_miev_evo', drivetrain: 'FF' },
  { name: 'Mitsubishi MR2', value: 'mitsubishi_mr2', drivetrain: 'MR' },
  { name: 'Mitsubishi Pajero', value: 'mitsubishi_pajero', drivetrain: '4WD' },
  { name: 'Mitsubishi XR-PHEV GT', value: 'mitsubishi_xr_phev_gt', drivetrain: '4WD' },
  
  // Nissan
  { name: 'Nissan 300ZX Twin Turbo', value: 'nissan_300zx_twin_turbo', drivetrain: 'FR' },
  { name: 'Nissan 370Z', value: 'nissan_370z', drivetrain: 'FR' },
  { name: 'Nissan 370Z Nismo', value: 'nissan_370z_nismo', drivetrain: 'FR' },
  { name: 'Nissan Ariya Concept', value: 'nissan_ariya_concept', drivetrain: 'FF' },
  { name: 'Nissan Ariya GT4', value: 'nissan_ariya_gt4', drivetrain: '4WD' },
  { name: 'Nissan Fairlady Z', value: 'nissan_fairlady_z', drivetrain: 'FR' },
  { name: 'Nissan Fairlady Z S30', value: 'nissan_fairlady_z_s30', drivetrain: 'FR' },
  { name: 'Nissan Fairlady Z Version S', value: 'nissan_fairlady_z_version_s', drivetrain: 'FR' },
  { name: 'Nissan Fairlady Z Z34', value: 'nissan_fairlady_z_z34', drivetrain: 'FR' },
  { name: 'Nissan Fairlady Z Z35', value: 'nissan_fairlady_z_z35', drivetrain: 'FR' },
  { name: 'Nissan GT-R', value: 'nissan_gt_r', drivetrain: '4WD' },
  { name: 'Nissan GT-R GT3', value: 'nissan_gt_r_gt3', drivetrain: 'FR' },
  { name: 'Nissan GT-R Gr.3', value: 'nissan_gt_r_gr3', drivetrain: 'FR' },
  { name: 'Nissan GT-R Nismo GT500', value: 'nissan_gt_r_nismo_gt500', drivetrain: 'FR' },
  { name: 'Nissan GT-R Premium', value: 'nissan_gt_r_premium', drivetrain: '4WD' },
  { name: 'Nissan Leaf EV', value: 'nissan_leaf_ev', drivetrain: 'FF' },
  { name: 'Nissan Latio', value: 'nissan_latio', drivetrain: 'FF' },
  { name: 'Nissan Pulsar GTi-R', value: 'nissan_pulsar_gti_r', drivetrain: '4WD' },
  { name: 'Nissan R390 GT1', value: 'nissan_r390_gt1', drivetrain: 'FR' },
  { name: 'Nissan Skyline Coupe', value: 'nissan_skyline_coupe', drivetrain: 'FR' },
  { name: 'Nissan Skyline GT-R V-Spec', value: 'nissan_skyline_gt_r_v_spec', drivetrain: '4WD' },
  { name: 'Nissan Skyline GT-R R32', value: 'nissan_skyline_gt_r_r32', drivetrain: '4WD' },
  { name: 'Nissan Skyline GT-R R33', value: 'nissan_skyline_gt_r_r33', drivetrain: '4WD' },
  { name: 'Nissan Skyline GT-R R34', value: 'nissan_skyline_gt_r_r34', drivetrain: '4WD' },
  { name: 'Nissan Skyline GT-R R35', value: 'nissan_skyline_gt_r_r35', drivetrain: '4WD' },
  { name: 'Nissan Silvia', value: 'nissan_silvia', drivetrain: 'FR' },
  { name: 'Nissan Silvia S13', value: 'nissan_silvia_s13', drivetrain: 'FR' },
  { name: 'Nissan Silvia S14', value: 'nissan_silvia_s14', drivetrain: 'FR' },
  { name: 'Nissan Silvia S14 K\'s', value: 'nissan_silvia_s14_k_s', drivetrain: 'FR' },
  { name: 'Nissan Silvia S15', value: 'nissan_silvia_s15', drivetrain: 'FR' },
  { name: 'Nissan Silvia S15 Spec-R', value: 'nissan_silvia_s15_spec_r', drivetrain: 'FR' },
  { name: 'Nissan Z Proto', value: 'nissan_z_proto', drivetrain: 'FR' },
  { name: 'Nissan Z Version ST', value: 'nissan_z_version_st', drivetrain: 'FR' },
  
  // Pagani
  { name: 'Pagani Huayra', value: 'pagani_huayra', drivetrain: 'MR' },
  { name: 'Pagani Huayra BC', value: 'pagani_huayra_bc', drivetrain: 'MR' },
  { name: 'Pagani Imola', value: 'pagani_imola', drivetrain: 'MR' },
  { name: 'Pagani Zonda Cinque', value: 'pagani_zonda_cinque', drivetrain: 'MR' },
  { name: 'Pagani Zonda Roadster', value: 'pagani_zonda_roadster', drivetrain: 'MR' },
  { name: 'Pagani Zonda F', value: 'pagani_zonda_f', drivetrain: 'MR' },
  { name: 'Pagani Zonda R', value: 'pagani_zonda_r', drivetrain: 'MR' },
  { name: 'Pagani Zonda Rivoluzione', value: 'pagani_zonda_rivoluzione', drivetrain: 'MR' },
  
  // Peugeot
  { name: 'Peugeot 905', value: 'peugeot_905', drivetrain: 'FR' },
  { name: 'Peugeot e-Legend Vision GT', value: 'peugeot_e_legend_vision_gt', drivetrain: 'FF' },
  
  // Plymouth
  { name: 'Plymouth Road Runner', value: 'plymouth_road_runner', drivetrain: 'FR' },
  
  // Pontiac
  { name: 'Pontiac GTO Judge', value: 'pontiac_gto_judge', drivetrain: 'FR' },
  { name: 'Pontiac Solstice', value: 'pontiac_solstice', drivetrain: 'FR' },
  { name: 'Pontiac Trans Am', value: 'pontiac_trans_am', drivetrain: 'FR' },
  
  // Porsche
  { name: 'Porsche 356-A Carrera', value: 'porsche_356_a_carrera', drivetrain: 'RR' },
  { name: 'Porsche 550 Spyder', value: 'porsche_550_spyder', drivetrain: 'RR' },
  { name: 'Porsche 911 Carrera 2.7 RS', value: 'porsche_911_carrera_2_7_rs', drivetrain: 'RR' },
  { name: 'Porsche 911 Carrera RS', value: 'porsche_911_carrera_rs', drivetrain: 'RR' },
  { name: 'Porsche 911 Daytona', value: 'porsche_911_daytona', drivetrain: 'RR' },
  { name: 'Porsche 911 F Model', value: 'porsche_911_f_model', drivetrain: 'RR' },
  { name: 'Porsche 911 GT1 96', value: 'porsche_911_gt1_96', drivetrain: 'RR' },
  { name: 'Porsche 911 GT2', value: 'porsche_911_gt2', drivetrain: 'RR' },
  { name: 'Porsche 911 GT2 RS', value: 'porsche_911_gt2_rs', drivetrain: 'RR' },
  { name: 'Porsche 911 GT3', value: 'porsche_911_gt3', drivetrain: 'RR' },
  { name: 'Porsche 911 GT3 R', value: 'porsche_911_gt3_r', drivetrain: 'RR' },
  { name: 'Porsche 911 GT3 RS', value: 'porsche_911_gt3_rs', drivetrain: 'RR' },
  { name: 'Porsche 911 GT3 RS 4.0', value: 'porsche_911_gt3_rs_4_0', drivetrain: 'RR' },
  { name: 'Porsche 911 RSR 2017', value: 'porsche_911_rsr_2017', drivetrain: 'RR' },
  { name: 'Porsche 911 S', value: 'porsche_911_s', drivetrain: 'RR' },
  { name: 'Porsche 911 Speedster', value: 'porsche_911_speedster', drivetrain: 'RR' },
  { name: 'Porsche 911 Turbo', value: 'porsche_911_turbo', drivetrain: 'RR' },
  { name: 'Porsche 911 Turbo 3.2', value: 'porsche_911_turbo_3_2', drivetrain: 'RR' },
  { name: 'Porsche 911 Turbo 3.6', value: 'porsche_911_turbo_3_6', drivetrain: 'RR' },
  { name: 'Porsche 918 Spyder', value: 'porsche_918_spyder', drivetrain: 'MR' },
  { name: 'Porsche 924', value: 'porsche_924', drivetrain: 'FR' },
  { name: 'Porsche 944', value: 'porsche_944', drivetrain: 'FR' },
  { name: 'Porsche 944 Turbo', value: 'porsche_944_turbo', drivetrain: 'FR' },
  { name: 'Porsche 956', value: 'porsche_956', drivetrain: 'MR' },
  { name: 'Porsche 992 Vision GT', value: 'porsche_992_vision_gt', drivetrain: 'RR' },
  { name: 'Porsche Macan Turbo', value: 'porsche_macan_turbo', drivetrain: '4WD' },
  { name: 'Porsche Panamera Turbo', value: 'porsche_panamera_turbo', drivetrain: 'FR' },
  { name: 'Porsche Taycan Turbo S', value: 'porsche_taycan_turbo_s', drivetrain: '4WD' },
  
  // RAM
  { name: 'RAM 1500 TRX', value: 'ram_1500_trx', drivetrain: '4WD' },
  
  // Renault
  { name: 'Renault 5 Turbo', value: 'renault_5_turbo', drivetrain: 'FF' },
  { name: 'Renault Clio V6', value: 'renault_clio_v6', drivetrain: 'MR' },
  { name: 'Renault Megane R.S.', value: 'renault_megane_r_s', drivetrain: 'FF' },
  
  // Subaru
  { name: 'Subaru 360', value: 'subaru_360', drivetrain: 'RR' },
  { name: 'Subaru BRZ', value: 'subaru_brz', drivetrain: 'FR' },
  { name: 'Subaru BRZ S4 Prototype', value: 'subaru_brz_s4_prototype', drivetrain: '4WD' },
  { name: 'Subaru Impreza 2.0R', value: 'subaru_impreza_2_0r', drivetrain: '4WD' },
  { name: 'Subaru Impreza coupe WRX', value: 'subaru_impreza_coupe_wrx', drivetrain: '4WD' },
  { name: 'Subaru Impreza Sedan WRX', value: 'subaru_impreza_sedan_wrx', drivetrain: '4WD' },
  { name: 'Subaru Impreza WRX STI', value: 'subaru_impreza_wrx_sti', drivetrain: '4WD' },
  { name: 'Subaru STI Performance', value: 'subaru_sti_performance', drivetrain: '4WD' },
  { name: 'Subaru Viziv GT Vision GT', value: 'subaru_viziv_gt_vision_gt', drivetrain: '4WD' },
  { name: 'Subaru WRX STI', value: 'subaru_wrx_sti', drivetrain: '4WD' },
  { name: 'Subaru WRX STI 2018', value: 'subaru_wrx_sti_2018', drivetrain: '4WD' },
  
  // Suzuki
  { name: 'Suzuki Escudo Pikes Peak', value: 'suzuki_escudo_pikes_peak', drivetrain: '4WD' },
  { name: 'Suzuki Swift Sport', value: 'suzuki_swift_sport', drivetrain: 'FF' },
  { name: 'Suzuki Vision GT', value: 'suzuki_vision_gt', drivetrain: 'MR' },
  
  // Tommy Kaira
  { name: 'Tommy Kaira Zarame', value: 'tommy_kaira_zarame', drivetrain: 'FR' },
  
  // Toyota
  { name: 'Toyota 2000GT', value: 'toyota_2000gt', drivetrain: 'FR' },
  { name: 'Toyota 86', value: 'toyota_86', drivetrain: 'FR' },
  { name: 'Toyota 86 Gr.3', value: 'toyota_86_gr3', drivetrain: 'FR' },
  { name: 'Toyota 86 Gr.4', value: 'toyota_86_gr4', drivetrain: 'FR' },
  { name: 'Toyota Aqua', value: 'toyota_aqua', drivetrain: 'FF' },
  { name: 'Toyota Aqua S', value: 'toyota_aqua_s', drivetrain: 'FF' },
  { name: 'Toyota AE86 Corolla Levin', value: 'toyota_ae86_corolla_levin', drivetrain: 'FR' },
  { name: 'Toyota AE86 Trueno Sprinter', value: 'toyota_ae86_trueno_sprinter', drivetrain: 'FR' },
  { name: 'Toyota bZ4X Concept', value: 'toyota_bz4x_concept', drivetrain: '4WD' },
  { name: 'Toyota Camry', value: 'toyota_camry', drivetrain: 'FF' },
  { name: 'Toyota Celica 1982', value: 'toyota_celica_1982', drivetrain: 'FR' },
  { name: 'Toyota Celica GT4', value: 'toyota_celica_gt4', drivetrain: '4WD' },
  { name: 'Toyota Corolla Levin', value: 'toyota_corolla_levin', drivetrain: 'FR' },
  { name: 'Toyota Corolla Sport', value: 'toyota_corolla_sport', drivetrain: 'FF' },
  { name: 'Toyota Corolla Touring', value: 'toyota_corolla_touring', drivetrain: 'FF' },
  { name: 'Toyota FT-1 Vision GT', value: 'toyota_ft_1_vision_gt', drivetrain: 'FR' },
  { name: 'Toyota GR Corolla', value: 'toyota_gr_corolla', drivetrain: '4WD' },
  { name: 'Toyota GR Supra', value: 'toyota_gr_supra', drivetrain: 'FR' },
  { name: 'Toyota GR Yaris', value: 'toyota_gr_yaris', drivetrain: '4WD' },
  { name: 'Toyota GR86', value: 'toyota_gr86', drivetrain: 'FR' },
  { name: 'Toyota Harrier Hybrid', value: 'toyota_harrier_hybrid', drivetrain: '4WD' },
  { name: 'Toyota Land Cruiser 100', value: 'toyota_land_cruiser_100', drivetrain: '4WD' },
  { name: 'Toyota Land Cruiser 200', value: 'toyota_land_cruiser_200', drivetrain: '4WD' },
  { name: 'Toyota Land Cruiser 300', value: 'toyota_land_cruiser_300', drivetrain: '4WD' },
  { name: 'Toyota Mirai 2020', value: 'toyota_mirai_2020', drivetrain: 'FF' },
  { name: 'Toyota Mirai 2011', value: 'toyota_mirai_2011', drivetrain: 'FF' },
  { name: 'Toyota MR2', value: 'toyota_mr2', drivetrain: 'MR' },
  { name: 'Toyota MR2 GT', value: 'toyota_mr2_gt', drivetrain: 'MR' },
  { name: 'Toyota MR-S Roadster', value: 'toyota_mr_s_roadster', drivetrain: 'MR' },
  { name: 'Toyota Noah', value: 'toyota_noah', drivetrain: 'FF' },
  { name: 'Toyota Prius', value: 'toyota_prius', drivetrain: 'FF' },
  { name: 'Toyota Prius Prime', value: 'toyota_prius_prime', drivetrain: 'FF' },
  { name: 'Toyota Supra', value: 'toyota_supra', drivetrain: 'FR' },
  { name: 'Toyota Supra A80', value: 'toyota_supra_a80', drivetrain: 'FR' },
  { name: 'Toyota Supra RZ', value: 'toyota_supra_rz', drivetrain: 'FR' },
  { name: 'Toyota Tundra', value: 'toyota_tundra', drivetrain: '4WD' },
  { name: 'Toyota TS020', value: 'toyota_ts020', drivetrain: 'MR' },
  { name: 'Toyota TS050 Hybrid', value: 'toyota_ts050_hybrid', drivetrain: 'MR' },
  { name: 'Toyota Yaris', value: 'toyota_yaris', drivetrain: 'FF' },
  { name: 'Toyota Yaris GR', value: 'toyota_yaris_gr', drivetrain: '4WD' },
  
  // TVR
  { name: 'TVR Cerbera', value: 'tvr_cerbera', drivetrain: 'FR' },
  { name: 'TVR Griffith 500', value: 'tvr_griffith_500', drivetrain: 'FR' },
  { name: 'TVR Sagaris', value: 'tvr_sagaris', drivetrain: 'FR' },
  
  // Ultima
  { name: 'Ultima Evo', value: 'ultima_evo', drivetrain: 'FR' },
  
  // Vauxhall
  { name: 'Vauxhall Vectra VXR', value: 'vauxhall_vectra_vxr', drivetrain: 'FF' },
  
  // Venturi
  { name: 'Venturi Fétish', value: 'venturi_fetish', drivetrain: 'MR' },
  
  // Volkswagen
  { name: 'Volkswagen Beetle', value: 'volkswagen_beetle', drivetrain: 'FF' },
  { name: 'Volkswagen Golf I GTI', value: 'volkswagen_golf_i_gti', drivetrain: 'FF' },
  { name: 'Volkswagen Golf II G60', value: 'volkswagen_golf_ii_g60', drivetrain: 'FF' },
  { name: 'Volkswagen Golf VII R', value: 'volkswagen_golf_vii_r', drivetrain: '4WD' },
  { name: 'Volkswagen Golf R32', value: 'volkswagen_golf_r32', drivetrain: '4WD' },
  { name: 'Volkswagen Golf VI GTi', value: 'volkswagen_golf_vi_gti', drivetrain: 'FF' },
  { name: 'Volkswagen ID.R Pikes Peak', value: 'volkswagen_idr_pikes_peak', drivetrain: '4WD' },
  { name: 'Volkswagen Jetta GLI', value: 'volkswagen_jetta_gli', drivetrain: 'FF' },
  { name: 'Volkswagen Scirocco GT', value: 'volkswagen_scirocco_gt', drivetrain: 'FF' },
  { name: 'Volkswagen Sirocco GT', value: 'volkswagen_sirocco_gt', drivetrain: 'FF' },
  
  // Volvo
  { name: 'Volvo 242 Evolution', value: 'volvo_242_evolution', drivetrain: 'FR' },
  { name: 'Volvo S60 Polestar', value: 'volvo_s60_polestar', drivetrain: 'FF' },
];

// Export for autocomplete filtering
export const CAR_NAMES = CARS.map(car => car.name);
export const CAR_MAP = Object.fromEntries(CARS.map(car => [car.value, car]));
