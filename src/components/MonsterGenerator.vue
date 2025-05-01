<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" lg="6">
        <!-- Monster Generation Form -->
        <v-card class="mb-4">
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon start icon="mdi-sword" class="mr-2"></v-icon>
            Generate Monster
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="generateMonster">
              <v-textarea
                v-model="monsterDescription"
                label="Monster Description"
                placeholder="Describe the monster you want to create (e.g., 'A terrifying creature that lurks in ancient ruins, feeding on magical energy')"
                rows="3"
                class="mb-4"
              ></v-textarea>
              
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="minCR"
                    type="number"
                    label="Min CR"
                    min="0"
                    max="30"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="maxCR"
                    type="number"
                    label="Max CR"
                    min="0"
                    max="30"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Party Composition Section -->
              <v-card-subtitle class="px-0 font-weight-bold">
                Party Composition
              </v-card-subtitle>
              <div class="party-members mb-4">
                <v-row v-for="(member, index) in partyMembers" :key="index" class="mb-2">
                  <v-col cols="6">
                    <v-select
                      v-model="member.class"
                      :items="characterClasses"
                      label="Class"
                      placeholder="Select Class"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="member.level"
                      type="number"
                      label="Level"
                      min="1"
                      max="20"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" class="d-flex align-center">
                    <v-btn
                      icon
                      color="error"
                      variant="text"
                      @click="removePartyMember(index)"
                      :disabled="partyMembers.length <= 1"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              
              <v-btn
                prepend-icon="mdi-plus"
                variant="text"
                color="primary"
                class="mb-4"
                @click="addPartyMember"
              >
                Add Party Member
              </v-btn>

              <v-select
                v-model="encounterDifficulty"
                :items="['easy', 'medium', 'hard', 'deadly']"
                label="Encounter Difficulty"
                class="mb-4"
              ></v-select>

              <v-btn
                block
                color="primary"
                size="large"
                type="submit"
                :loading="isLoading"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Generating...' : 'Generate Monster' }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <!-- Monster Display -->
        <v-card>
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon start icon="mdi-book-open-variant" class="mr-2"></v-icon>
            Monster Stat Block
          </v-card-title>
          <v-card-text>
            <template v-if="monster">
              <div class="monster-image mb-6">
                <v-img
                  v-if="monsterImage"
                  :src="monsterImage"
                  :aspect-ratio="1"
                  cover
                  class="rounded-lg elevation-3"
                  :class="{'monster-image-zoom': isImageZoomed}"
                  @click="isImageZoomed = !isImageZoomed"
                ></v-img>
              </div>
              <div class="stat-block" v-html="formattedStatBlock"></div>
              <v-divider class="my-4"></v-divider>
              <div class="encounter-analysis">
                <div class="text-h6 mb-2">Encounter Analysis</div>
                <p>{{ encounterAnalysis }}</p>
              </div>
            </template>
            <v-alert
              v-else
              type="info"
              variant="tonal"
              icon="mdi-information"
            >
              Generate a monster to see its stat block and encounter analysis here
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import OpenAI from 'openai'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

// State
const monsterDescription = ref('')
const minCR = ref(0)
const maxCR = ref(30)
const monster = ref<any>(null)
const monsterImage = ref('')
const encounterDifficulty = ref('medium')
const encounterAnalysis = ref('')
const isLoading = ref(false)
const isImageZoomed = ref(false)

// Party composition
const characterClasses = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
]

interface PartyMember {
  class: string
  level: number
}

const partyMembers = ref<PartyMember[]>([
  { class: '', level: 1 }
])

const addPartyMember = () => {
  partyMembers.value.push({ class: '', level: 1 })
}

const removePartyMember = (index: number) => {
  if (partyMembers.value.length > 1) {
    partyMembers.value.splice(index, 1)
  }
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

// Methods
const generateMonster = async () => {
  if (!monsterDescription.value.trim()) {
    alert('Please provide a monster description')
    return
  }

  if (!partyMembers.value.some(member => member.class && member.level)) {
    alert('Please add at least one party member with class and level')
    return
  }

  isLoading.value = true

  try {
    const partyAnalysis = partyMembers.value
      .filter(member => member.class && member.level)
      .map(member => `${member.class} (Level ${member.level})`)
      .join(', ')

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a D&D 5e monster creator specializing in balanced encounter design. 
          Create a complete and detailed monster stat block in standard D&D 5e format. Include ALL of the following components:

          # [Monster Name]
          [Size] [type], [alignment]
          ___
          - **Armor Class** [AC] ([type of armor])
          - **Hit Points** [average] ([dice formula])
          - **Speed** [movement types and speeds]
          ___
          |   STR   |   DEX   |   CON   |   INT   |   WIS   |   CHA   |
          |:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
          | [score] ([modifier]) | [score] ([modifier]) | [score] ([modifier]) | [score] ([modifier]) | [score] ([modifier]) | [score] ([modifier]) |
          ___
          - **Saving Throws** [relevant saves]
          - **Skills** [relevant skills]
          - **Damage Resistances** [if any]
          - **Damage Immunities** [if any]
          - **Condition Immunities** [if any]
          - **Senses** [senses and ranges]
          - **Languages** [languages known]
          - **Challenge** [CR] ([XP])
          ___
          
          **[Special Traits]**
          
          **Actions**
          [List of actions with full descriptions]
          
          **[Bonus Actions/Reactions]** (if any)
          [List with full descriptions]

          **[Legendary Actions]** (if appropriate for CR)
          [List with full descriptions]

          Format the response with "---" on its own line to separate the stat block from the analysis section.
          
          After the separator, provide:
          1. Analysis of why this CR and abilities create a ${encounterDifficulty.value} encounter
          2. Tactical considerations for both monster and party
          3. Suggested environment and circumstances`
        },
        {
          role: 'user',
          content: `Create a monster based on this description: "${monsterDescription.value}"
          
          Party Composition: ${partyAnalysis}
          Desired Difficulty: ${encounterDifficulty.value}
          Target CR Range: ${minCR.value}-${maxCR.value}
          
          Ensure the stat block follows standard D&D 5e format with ALL required sections.`
        }
      ]
    })

    const content = response.choices[0].message.content || ''
    const [statBlock, analysis] = content.split('---').map(part => part.trim())
    monster.value = statBlock
    encounterAnalysis.value = analysis

    // Generate image
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `A detailed fantasy illustration of ${monsterDescription.value}, professional quality, dramatic lighting, D&D style`,
      n: 1,
      size: '1024x1024'
    })

    monsterImage.value = imageResponse.data[0].url
  } catch (error) {
    console.error('Error generating monster:', error)
    let errorMessage = 'Error generating monster. '
    if (error.response) {
      errorMessage += `API Error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
    } else if (error.message) {
      errorMessage += error.message
    } else {
      errorMessage += 'Please check your API key and try again.'
    }
    alert(errorMessage)
  } finally {
    isLoading.value = false
  }
}

// Computed
const formattedStatBlock = computed(() => {
  if (!monster.value) return ''
  const html = marked(monster.value)
  return DOMPurify.sanitize(html)
})
</script>

<style>
.stat-block {
  font-family: 'Noto Serif', serif;
  background-color: var(--v-background-base);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

:deep(.stat-block h1) {
  font-size: 1.5rem;
  color: var(--v-primary-base);
  border-bottom: 2px solid var(--v-primary-base);
  margin-bottom: 0.5rem;
}

:deep(.stat-block h2) {
  font-size: 1.25rem;
  color: var(--v-primary-base);
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}

:deep(.stat-block hr) {
  border-color: rgba(255, 255, 255, 0.12);
  margin: 0.5rem 0;
}

:deep(.stat-block table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

:deep(.stat-block th),
:deep(.stat-block td) {
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

:deep(.stat-block th) {
  background-color: rgba(255, 255, 255, 0.05);
  font-weight: 600;
}

:deep(.stat-block blockquote) {
  border-left: 4px solid var(--v-primary-base);
  margin: 1rem 0;
  padding-left: 1rem;
  color: rgba(255, 255, 255, 0.87);
}

.monster-image {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.monster-image-zoom {
  transform: scale(1.5);
  transform-origin: center;
  z-index: 10;
}

.prose {
  max-width: none;
}
</style> 