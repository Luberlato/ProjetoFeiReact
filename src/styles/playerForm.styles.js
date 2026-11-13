import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const playerFormStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    marginTop: theme.spacing.md,
  },
  inputFirstLabel: {
    marginTop: 0,
  },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.danger,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: theme.colors.textWhite,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: theme.colors.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
});
