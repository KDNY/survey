const testingItems = [
  {
    name_en: 'Blood Viscosity',
    name_secondary: '血液粘度',
    reference_range: '1.3 - 1.7',
    measurement_unit: 'mPa·s',
    risk_level_low: 1.3,
    risk_level_high: 1.7,
    interpretation: 'Indicates blood flow characteristics and potential circulation issues'
  },
  {
    name_en: 'Total Cholesterol (TC)',
    name_secondary: '总胆固醇',
    reference_range: '125 - 200',
    measurement_unit: 'mg/dL',
    risk_level_low: 125,
    risk_level_high: 200,
    interpretation: 'Measures overall cholesterol levels in blood'
  },
  {
    name_en: 'Triglyceride (TG)',
    name_secondary: '甘油三酯',
    reference_range: '50 - 150',
    measurement_unit: 'mg/dL',
    risk_level_low: 50,
    risk_level_high: 150,
    interpretation: 'Indicates fat levels in blood'
  },
  {
    name_en: 'High-Density Lipoprotein (HDL-C)',
    name_secondary: '高密度脂蛋白',
    reference_range: '40 - 60',
    measurement_unit: 'mg/dL',
    risk_level_low: 40,
    risk_level_high: null, // HDL doesn't have a high risk threshold
    interpretation: 'Good cholesterol that helps remove other forms of cholesterol'
  },
  {
    name_en: 'Low-Density Lipoprotein (LDL-C)',
    name_secondary: '低密度脂蛋白',
    reference_range: '70 - 130',
    measurement_unit: 'mg/dL',
    risk_level_low: null, // LDL doesn't have a low risk threshold
    risk_level_high: 130,
    interpretation: 'Bad cholesterol that can build up in arteries'
  },
  {
    name_en: 'Neutral Fat (MB)',
    name_secondary: '中性脂肪',
    reference_range: '3.5 - 5.2',
    measurement_unit: 'mmol/L',
    risk_level_low: 3.5,
    risk_level_high: 5.2,
    interpretation: 'Measures stored fat levels in the body'
  },
  {
    name_en: 'Circulating Immune Complex (CIC)',
    name_secondary: '循环免疫复合物',
    reference_range: '1.5 - 4.0',
    measurement_unit: 'μg/mL',
    risk_level_low: 1.5,
    risk_level_high: 4.0,
    interpretation: 'Indicates immune system activity and potential autoimmune responses'
  }
]

export const seedTestingItems = async (supabase) => {
  try {
    // First, clear existing items (optional)
    const { error: deleteError } = await supabase
      .from('testing_items')
      .delete()
      .not('id', 'is', null) // Delete all records

    if (deleteError) throw deleteError

    // Insert new items
    const { data, error } = await supabase
      .from('testing_items')
      .insert(testingItems)
      .select()

    if (error) throw error
    
    console.log('Successfully seeded testing items:', data)
    return data
  } catch (error) {
    console.error('Error seeding data:', error)
    throw error
  }
} 