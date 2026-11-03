
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView
} from 'react-native';

const desserts = [
  { name: 'Classic Baklava', emoji: '🥮', points: 10 },
  { name: 'Pistachio Baklava', emoji: '💚', points: 10 },
  { name: 'Walnut Baklava', emoji: '🌰', points: 10 },
  { name: 'Sobiyet', emoji: '🍯', points: 15 },
];

const customers = [
  { name: 'Sophia', emoji: '👩🏻' },
  { name: 'James', emoji: '👨🏻' },
  { name: 'Emma', emoji: '👩🏽' },
  { name: 'Oliver', emoji: '👨🏽' },
  { name: 'Mia', emoji: '👩🏼' },
  { name: 'Noah', emoji: '👨🏼' },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [order, setOrder] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [lastCustomer, setLastCustomer] = useState(-1);
  const [busy, setBusy] = useState(false);

  const currentDessert = desserts[order % desserts.length];
  const customer = customers[order % customers.length];

  useEffect(() => {
    if (!started || gameOver) return;

    if (time <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => {
      setTime(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [started, time, gameOver]);

  const startGame = () => {
    setScore(0);
    setTime(60);
    setOrder(0);
    setFeedback('');
    setGameOver(false);
    setBusy(false);
    setStarted(true);
  };

  const serve = (dessert) => {
    if (busy || gameOver) return;

    setBusy(true);

    const correct = dessert.name === currentDessert.name;

    if (correct) {
      setScore(s => s + dessert.points);
      setFeedback('🎉 PERFECT! +' + dessert.points + ' POINTS');
    } else {
      setScore(s => s - 5);
      setFeedback('❌ WRONG ORDER! -5 POINTS');
    }

    let nextCustomer = (order + 1) % customers.length;

    if (nextCustomer === lastCustomer) {
      nextCustomer = (nextCustomer + 1) % customers.length;
    }

    setLastCustomer(order % customers.length);

    setTimeout(() => {
      setOrder(o => o + 1);
      setFeedback('');
      setBusy(false);
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.logo}>🍯</Text>
        <Text style={styles.title}>BAKLAVA RUSH</Text>
        <Text style={styles.subtitle}>THE ULTIMATE DESSERT CHALLENGE</Text>

        {!started ? (
          <View style={styles.panel}>
            <Text style={styles.big}>🥮</Text>
            <Text style={styles.heading}>Welcome to Baklava Shop!</Text>
            <Text style={styles.description}>
              Serve your customers delicious Turkish desserts!
            </Text>
            <Text style={styles.description}>
              Earn points and become the Baklava Master!
            </Text>
            <TouchableOpacity style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>START GAME</Text>
            </TouchableOpacity>
          </View>
        ) : gameOver ? (
          <View style={styles.panel}>
            <Text style={styles.big}>🏆</Text>
            <Text style={styles.heading}>GAME OVER!</Text>
            <Text style={styles.description}>Time is up!</Text>
            <Text style={styles.finalScore}>{score} POINTS</Text>
            <Text style={styles.description}>
              Great job serving your customers!
            </Text>
            <TouchableOpacity style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.game}>
            <View style={styles.stats}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>YOUR SCORE</Text>
                <Text style={styles.stat}>⭐ {score}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>TIME LEFT</Text>
                <Text style={styles.stat}>⏱️ {time}s</Text>
              </View>
            </View>

            <View style={styles.shop}>
              <Text style={styles.shopEmoji}>🏪</Text>
              <Text style={styles.shopTitle}>SWEET PALACE</Text>
              <Text style={styles.shopSubtitle}>Traditional Turkish Desserts</Text>
            </View>

            <View style={styles.panel}>
              <Text style={styles.smallTitle}>CUSTOMER #{order + 1}</Text>
              <Text style={styles.customerEmoji}>
                {customer.emoji}
              </Text>
              <Text style={styles.heading}>
                Hello! I'm {customer.name}
              </Text>
              <Text style={styles.description}>
                I would like:
              </Text>
              <Text style={styles.big}>
                {currentDessert.emoji}
              </Text>
              <Text style={styles.order}>
                {currentDessert.name}
              </Text>
              <Text style={styles.description}>
                Please serve my dessert!
              </Text>
            </View>

            <Text style={styles.sectionTitle}>CHOOSE A DESSERT</Text>

            {desserts.map((dessert, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  busy && styles.disabledCard
                ]}
                onPress={() => serve(dessert)}
                disabled={busy}
              >
                <Text style={styles.dessert}>
                  {dessert.emoji} {dessert.name}
                </Text>
                <Text style={styles.points}>
                  +{dessert.points} POINTS
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.feedback}>
              <Text style={styles.feedbackText}>
                {feedback || '⭐ Correct: +10 / +15   |   Wrong: -5'}
              </Text>
            </View>

            <Text style={styles.footer}>
              Made with love and pistachios 💚
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#542A19',
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
  },
  logo: {
    fontSize: 45,
  },
  title: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#FFD27A',
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFF0D5',
    letterSpacing: 2,
    fontSize: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  shop: {
    backgroundColor: '#A85D25',
    width: '100%',
    borderRadius: 18,
    padding: 15,
    alignItems: 'center',
    marginTop: 18,
  },
  shopEmoji: {
    fontSize: 35,
  },
  shopTitle: {
    color: '#FFF0D5',
    fontWeight: 'bold',
    fontSize: 20,
  },
  shopSubtitle: {
    color: '#FFE0A5',
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
  },
  statBox: {
    backgroundColor: '#75452B',
    padding: 12,
    borderRadius: 14,
    width: '48%',
    alignItems: 'center',
  },
  statLabel: {
    color: '#FFE0A5',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stat: {
    color: '#FFD27A',
    fontSize: 20,
    fontWeight: 'bold',
  },
  panel: {
    backgroundColor: '#F9DDAA',
    borderRadius: 22,
    padding: 22,
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
  },
  smallTitle: {
    color: '#A85D25',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  customerEmoji: {
    fontSize: 65,
    marginTop: 8,
  },
  big: {
    fontSize: 52,
    margin: 10,
  },
  heading: {
    color: '#542A19',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    color: '#75452B',
    textAlign: 'center',
    marginVertical: 8,
  },
  order: {
    color: '#542A19',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#FFD27A',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFF0D5',
    padding: 18,
    borderRadius: 17,
    marginVertical: 7,
    alignItems: 'center',
    width: '100%',
  },
  disabledCard: {
    opacity: 0.6,
  },
  dessert: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#542A19',
  },
  points: {
    color: '#A85D25',
    marginTop: 5,
    fontWeight: 'bold',
  },
  feedback: {
    backgroundColor: '#75452B',
    padding: 15,
    borderRadius: 14,
    width: '100%',
    marginTop: 15,
  },
  feedbackText: {
    color: '#FFD27A',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#A85D25',
    padding: 17,
    borderRadius: 14,
    width: '100%',
    marginTop: 18,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  finalScore: {
    color: '#A85D25',
    fontSize: 32,
    fontWeight: 'bold',
    margin: 15,
  },
  footer: {
    color: '#FFE0A5',
    marginTop: 25,
    textAlign: 'center',
  },
});
